import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {TextInput, Button, Colors} from 'react-native-paper';
import {useIntl} from 'react-intl';
import {useFormik} from 'formik';
import {isEmpty, noop} from 'lodash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null as any,
    height: null as any,
    resizeMode: 'contain',
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
    backgroundColor: Colors.red500,
    color: Colors.white,
  },
});

function validateEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

type EmailFormValue = {
  email: string;
};

export default function LoginByEmail() {
  const {formatMessage} = useIntl();

  const {
    handleSubmit,
    handleChange,
    values: {email},
    errors,
  } = useFormik<EmailFormValue>({
    initialValues: {
      email: '',
    },
    validate: (values) => {
      if (!values.email) {
        return {email: 'login.errors.email.required'};
      }
      if (!validateEmail(values.email)) {
        return {email: 'login.errors.email.invalid'};
      }
    },
    onSubmit: (values) => {
      // TODO
      console.log(values);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          }}
          style={styles.image}
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
          disabled={!isEmpty(errors)}
          uppercase={false}
          style={styles.login}>
          {formatMessage({id: 'login.login'})}
        </Button>
      </View>
    </View>
  );
}
