const moment = require('moment');
const { v1: uuidV1 } = require('uuid');
const twoFactor = require('node-2fa');
const {
  user: UserModel, otp: OTPModel, sequelize,
} = require('../models');
const Helper = require('../utils/helper');
const OtpService = require('../utils/otp');
const {
  USER_TYPE, USER_STATUS, OTP_TYPE, LOGIN_TYPE,
} = require('../utils/constant');
const authentication = require('./authentication');
const ErrorCode = require('../utils/error');

const register = async (payload) => {
  const { email } = payload;

  try {
    const response = await UserModel.findOne({
      where: { email, user_type: USER_TYPE.CUSTOMER },
      attributes: [ 'status', 'created_at' ],
    });

    const { otp: __otp, validity: __validity, currentDate } = Helper.generateOTP();
    let otp = __otp;
    let validity = __validity;
    const publicId = uuidV1();

    const type = OTP_TYPE.USER_REGISTRAION;

    const otpResponse = await OTPModel.findOne({
      attributes: [ 'id', 'otp', 'created_at', 'validity' ],
      order: [ [ 'created_at', 'desc' ] ],
      where: { email },
    });

    if (otpResponse) {
      const {
        dataValues: { created_at: createdAt, otp: _otp, validity: _validity },
      } = otpResponse;

      if (moment().utc().diff(moment(createdAt), 'seconds') < 30) {
        return {
          errors: [ {
            name: 'email',
            messages: {
              en: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP!',
              sw: 'Kikomo cha ombi la OTP kilipitwa. Tafadhali subiri kwa sekunde 30 kabla ya kuomba OTP nyingine!',
            },
            message: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP',
          } ],
        };
      }

      if (moment().utc().diff(moment(createdAt), 'seconds') < 600 && _validity > Date.now()) {
        otp = _otp;
        validity = _validity;
      }
    }

    const doc = Helper.convertCamelToSnake({
      type, email, otp, validity, publicId,
    });

    if (response) {
      const { dataValues: { status, created_at: createdAt } } = response;

      if (status.toLowerCase() !== USER_STATUS.ACTIVE.toLowerCase()) {
        return { errors: [ { name: 'user', message: 'user is not in active state.' } ] };
      }

      if (moment().utc().diff(moment(createdAt), 'seconds') < 30) {
        return {
          errors: [ {
            name: 'email',
            message: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP',
            messages: {
              en: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP!',
              sw: 'Kikomo cha ombi la OTP kilipitwa. Tafadhali subiri kwa sekunde 30 kabla ya kuomba OTP nyingine!',
            },
          } ],
        };
      }

      await OTPModel.create(doc);
      await UserModel.update({ concurrency_stamp: uuidV1() }, { where: { email, user_type: USER_TYPE.CUSTOMER } });

      const { doc: mailRes } = await OtpService.send({
        email, type, otp, validity, currentDate, referenceId: publicId,
      });

      if (!mailRes) {
        return { errors: [ { name: 'mail_service', message: 'mail service is down' } ] };
      }

      return { doc: { message: 'Verification code sent to mail id.' } };
    }

    await OTPModel.create(doc);
    await UserModel.create({
      user_type: USER_TYPE.CUSTOMER,
      public_id: uuidV1(),
      concurrency_stamp: uuidV1(),
      email,
    });

    const { doc: mailRes } = await OtpService.send({
      email, type, otp, validity, currentDate, referenceId: publicId,
    });

    if (!mailRes) {
      return { errors: [ { name: 'mail_service', message: 'mail service is down' } ] };
    }

    return { doc: { message: 'Verification code sent to mail id.' } };
  } catch (error) {
    return { err: error.message };
  }
};

const verification = async (payload) => {
  const { email, otp } = payload;

  try {
    const res = await UserModel.findOne({
      where: { email, user_type: USER_TYPE.CUSTOMER },
      attributes: [ 'mobile_number', 'user_type', 'email', [ 'public_id', 'user_id' ] ],
    });

    if (res) {
      const dataValues = Helper.convertSnakeToCamel(res.dataValues);
      const { userId } = dataValues;

      const response = await OTPModel.findOne({
        where: { email, type: OTP_TYPE.USER_REGISTRAION },
        attributes: [ 'id', 'otp', 'validity' ],
        order: [ [ 'id', 'desc' ] ],
      });

      if (response) {
        const { otp: otpResponse, validity, id } = response;

        if (otpResponse !== otp) {
          return {
            errors: [ {
              message: 'Please enter the correct OTP, or use Resend OTP! ',
              messages: {
                en: 'Please enter the correct OTP, or use Resend OTP! ',
                sw: 'Tafadhali ingiza OTP sahihi, au tumia Tuma Upya OTP!',
              },
              name: 'otp',
            } ],
          };
        }

        if (moment().utc().diff(moment(validity), 'seconds') >= 0) {
          return {
            errors: [ {
              message: 'OTP has been expired.',
              messages: {
                en: 'The OTP has expired.',
                sw: 'Muda wa OTP umekwisha.',
              },
              name: 'otp',
            } ],
          };
        }

        await OTPModel.update({ validity: Date.now() }, { where: { id } });
        await UserModel.update(
          { is_email_verified: true },
          {
            where: { public_id: userId },
          },
        );

        return {
          doc: { isEmailVerified: true },
        };
      }

      return {
        errors: [ {
          name: 'email',
          message: 'Please enter the correct OTP!',
          messages: {
            en: 'Please enter the correct OTP!',
            sw: 'Tafadhali weka OTP sahihi!',
          },
        } ],
      };
    }

    return { errors: [ { name: 'email', message: 'email is not registered' } ] };
  } catch (error) {
    return { err: error.message };
  }
};

const setPassword = async (payload) => {
  const { email, password, name } = payload;

  try {
    const where = { email, user_type: USER_TYPE.CUSTOMER };

    const response = await UserModel.findOne({
      where,
      attributes: [ [ 'public_id', 'user_id' ] ],
    });

    if (response) {
      const doc = Helper.convertSnakeToCamel(response.dataValues);

      const { userId } = doc;

      const salt = authentication.makeSalt();

      const hashedPassword = authentication.encryptPassword(password, salt);

      await UserModel.update({
        salt,
        hashed_password: hashedPassword,
        system_generated_password: false,
        name,
        last_login_at: new Date(),
      }, { where: { public_id: userId } });

      const { accessToken, refreshToken } = authentication.generateToken(userId, email);

      return {
        doc: {
          message: 'Password set successfully!',
          accessToken,
          refreshToken,
        },
      };
    }

    return {
      errors: [ { name: 'userName', message: 'user is not registered' } ],
    };
  } catch (error) {
    return { err: error.message };
  }
};

const login = async (payload) => {
  const { email, password, totp } = payload;
  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where:
          {
            email, user_type: USER_TYPE.CUSTOMER, is_email_verified: true,
          },
      transaction,
      lock: transaction.LOCK.UPDATE,
      attributes: [ 'hashed_password', 'salt', 'email', [ 'public_id', 'user_id' ], 'user_type',
        'is_email_verified', 'is_mobile_verified', 'mobile_number', 'system_generated_password',
        'status', 'is_mfa_enabled', 'mfa_secret' ],
    });

    if (response) {
      const doc = Helper.convertSnakeToCamel(response.dataValues);

      const {
        userId, status, hashedPassword, salt, systemGeneratedPassword, isMfaEnabled, mfaSecret, ...newDoc
      } = doc;

      if (status === USER_STATUS.ACTIVE) {
        const isValidPassword = authentication.verifyPassword(hashedPassword, password, salt);

        if (isValidPassword) {
          if (systemGeneratedPassword) {
            await transaction.rollback();

            return {
              errors: {
                errorCode: ErrorCode['100'],
                details: [ { name: 'isSystemGeneratedPassword', message: 'Invalid password! this password is system generated password' } ],
              },
            };
          }

          if (!isMfaEnabled) {
            await transaction.rollback();

            return {
              errors: {
                errorCode: ErrorCode['101'],
                details: [ { name: 'isMfaEnabled', message: 'Mfa not enabled!' } ],
              },
            };
          }

          if (isMfaEnabled) {
            if (!totp) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['101'],
                  details: [ { name: 'isMfaEnabled', message: 'Missing totp parameter!' } ],
                },
              };
            }

            const { delta } = twoFactor.verifyToken(mfaSecret, totp) || { delta: -2 };

            if (delta === -2) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'invalid MFA code' } ],
                },
              };
            }

            if (delta === -1) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'invalid MFA code,too late' } ],
                },
              };
            }

            if (delta === 1) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'invalid MFA code,too early' } ],
                },
              };
            }
          }

          await UserModel.update({ last_login_at: new Date() }, { where: { public_id: userId }, transaction });

          const signedPayload = { ...newDoc, loginType: LOGIN_TYPE.USER_NAME_PASSWORD };

          const { token, refreshToken, expiresIn } = await authentication.signToken(signedPayload);

          await transaction.commit();

          return {
            doc: { token, expiresIn, refreshToken },
          };
        }

        await transaction.rollback();

        return {
          errors: {
            details: [ { name: 'password', message: 'invalid password.' } ],
          },
        };
      }

      await transaction.rollback();

      return {
        errors: {
          errorCode: ErrorCode['400'],
          details: [ { name: 'userName', message: 'user is not active' } ],
        },
      };
    }

    await transaction.rollback();

    return {
      errors: {
        errorCode: ErrorCode['400'],
        details: [ { name: 'userName', message: 'user is not registered' } ],
      },
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const createMFA = async (payload) => {
  const { userId } = payload;

  const response = await UserModel.findOne({
    where: { public_id: userId },
    attributes: [ [ 'public_id', 'user_id' ], 'user_type',
      [ 'is_mfa_enabled', 'isMfaEnabled' ], 'mfa_secret' ],
  });

  if (response) {
    const { dataValues: { isMfaEnabled } } = response;

    if (!isMfaEnabled) {
      const { secret, uri, qr } = twoFactor.generateSecret({ name: 'agile', account: 'agile' });

      return { doc: { uri, qr, secret } };
    }

    return { errors: [ { name: '2FA', message: '2fa is already enabled for the account!' } ] };
  }

  return { errors: [ { name: 'User', message: 'User does not exist!' } ] };
};

const verifyMFA = async (payload) => {
  const { otp, secret, userId } = payload;
  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where: { public_id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (response) {
      const verified = twoFactor.verifyToken(secret, otp);

      if (verified) {
        const { delta } = verified;

        if (!delta) {
          await UserModel.update(
            {
              is_mfa_enabled: true,
              mfa_secret: secret,
            },
            {
              where: { public_id: userId },
              transaction,
            },
          );

          await transaction.commit();

          return { doc: { isVerified: true } };
        }

        await transaction.rollback();

        return { doc: { isVerified: false } };
      }

      await transaction.rollback();

      return { errors: [ { name: 'Otp', message: 'Otp is not correct!' } ] };
    }

    await transaction.rollback();

    return { errors: [ { name: 'User', message: 'User does not exist!' } ] };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = {
  register, verification, login, setPassword, createMFA, verifyMFA,
};
