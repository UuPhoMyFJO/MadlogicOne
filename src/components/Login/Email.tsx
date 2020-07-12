import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {TextInput, Button, Colors, useTheme} from 'react-native-paper';
import {useIntl} from 'react-intl';
import {useFormik} from 'formik';
import noop from 'lodash/noop';
import * as Yup from 'yup';
import {observer} from 'mobx-react-lite';

import {useStores} from '../../core/hooks/useStores';
import {useGlobalStyles} from '../../core/hooks/useGlobalStyle';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    width: '50%',
    color: Colors.white,
  },
});

type EmailFormValue = {
  email: string;
};

const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('login.errors.email.invalid')
    .required('login.errors.email.required'),
});

function LoginByEmail() {
  const {formatMessage} = useIntl();
  const theme = useTheme();
  const store = useStores();
  const [globalStyles] = useGlobalStyles(theme);

  const {
    handleSubmit,
    handleChange,
    values: {email},
    errors,
  } = useFormik<EmailFormValue>({
    initialValues: {
      email: '',
    },
    initialErrors: {
      email: 'login.errors.email.required',
    },
    validationSchema: EmailSchema,
    onSubmit: () => {
      store?.authorizationStore.authorize();
    },
  });

  return (
    <View style={globalStyles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={globalStyles.fullFlexImage}
          source={{uri: store?.ternantStore.logo?.logo}}
        />
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          label={formatMessage({id: 'login.email'})}
          value={email}
          onChangeText={handleChange('email') || noop}
          mode="outlined"
        />
      </View>
      <View style={styles.btnContainer}>
        <Button
          onPress={handleSubmit}
          mode="contained"
          disabled={Boolean(errors.email)}
          uppercase={false}
          color={Colors.red500}
          style={styles.login}>
          {formatMessage({id: 'login.login'})}
        </Button>
      </View>
    </View>
  );
}

export default observer(LoginByEmail);
