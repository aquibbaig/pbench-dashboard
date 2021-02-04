import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import AuthLayout from '@/components/AuthLayout';
import { AlertActionCloseButton } from '@patternfly/react-icons';
import {
  Title,
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  Alert,
} from '@patternfly/react-core';
import styles from './index.less';
import PasswordConstraints from '@/components/PasswordConstraints';
import { validatePassword } from '@/utils/validator';

const mapStateToProps = state => {
  const { auth } = state;
  return auth;
};

const PasswordRecovery = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableSubmitBtn, setEnableSubmitButton] = useState(false);
  const [constraints, setConstraints] = useState({
    passwordLength: 'unmet',
    passwordSpecialChars: 'unmet',
    passwordContainsNumber: 'unmet',
    passwordBlockLetter: 'unmet',
  });

  /* eslint-disable no-restricted-syntax */
  const validateForm = () => {
    // return early
    if (password.trim() === '' || confirmPassword.trim() === '') {
      return false;
    }
    // password constraints check.
    for (const ct of Object.entries(constraints)) {
      if (ct[1] === 'unmet') {
        return false;
      }
    }

    // return if any error is found
    for (const err of Object.entries(errors)) {
      if (err[1] !== '') {
        return false;
      }
    }

    // if we reach up to this point,
    // the form is validated.
    return true;
  };

  useEffect(
    () => {
      if (validateForm()) {
        setEnableSubmitButton(true);
      } else {
        setEnableSubmitButton(false);
      }
    },
    [password, confirmPassword]
  );

  const hideAlert = () => {
    setShowAlert(false);
  };

  const handlePasswordChange = val => {
    setPassword(val);
    const validPassword = validatePassword(val);
    setConstraints({
      ...constraints,
      ...validPassword,
    });
    // edge case where user deliberately
    // edits the password field, even when
    // confirm password is not empty.
    if (val === confirmPassword) {
      setErrors({ ...errors, passwordConfirm: '' });
    } else {
      setErrors({ ...errors, passwordConfirm: 'The above passwords do not match!' });
    }
  };

  const handleConfirmPasswordChange = cfPassword => {
    setConfirmPassword(cfPassword);
    if (cfPassword !== password) {
      setErrors({ ...errors, confirmPassword: 'The above passwords do not match' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const form = (
    <div className={styles.section}>
      {showAlert && (
        <Alert
          className={styles.alert}
          variant="success"
          title="Successfully changed your password!"
          action={<AlertActionCloseButton onClose={hideAlert} />}
        />
      )}
      <Title headingLevel="h4" size="xl">
        <b>Recover password</b>
      </Title>
      <br />
      <Form>
        <FormGroup label="Password" isRequired fieldId="horizontal-form-password">
          <TextInput isRequired type="password" onChange={handlePasswordChange} />
          <p className={styles.error}>{errors.password}</p>
        </FormGroup>
        <FormGroup label="Confirm Password" isRequired fieldId="horizontal-form-confirm-password">
          <TextInput isRequired type="password" onChange={handleConfirmPasswordChange} />
          <p className={styles.error}>{errors.confirmPassword}</p>
        </FormGroup>
        <PasswordConstraints constraints={constraints} />
        <ActionGroup>
          <Button
            isBlock
            // onClick={() => this.sendTempPasword()}
            {...(enableSubmitBtn === false ? { isDisabled: 'true' } : {})}
          >
            <Title headingLevel="h4" size="xl">
              Change Password
            </Title>
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
  return <AuthLayout toPreview={form} heading="Recover your password" backOpt="true" />;
};

export default connect(mapStateToProps)(PasswordRecovery);
