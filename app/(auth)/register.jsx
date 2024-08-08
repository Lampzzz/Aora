import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";

import { images } from "../../constants";
import { register } from "../../services/firebase";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const Register = () => {
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleRegister = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      await register(values.username, values.email, values.password);

      ToastAndroid.show("Created Successfully", ToastAndroid.SHORT);
      resetForm();
    } catch (error) {
      if (error.message === "Username is already in use") {
        setErrors({ username: error.message });
      } else if (error.message === "Email is already in use") {
        setErrors({ email: error.message });
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full h-[90vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-white text-xl text-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>
          <Formik
            initialValues={formValues}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              errors,
              isSubmitting,
              handleSubmit,
              values,
              touched,
            }) => (
              <>
                <FormField
                  title="Username"
                  value={values.username}
                  handleChangeText={handleChange("username")}
                  otherStyles="mt-7"
                  error={errors.username && errors.username}
                  touch={touched.username}
                />
                <FormField
                  title="Email"
                  value={values.email}
                  otherStyles="mt-7"
                  handleChangeText={handleChange("email")}
                  keyboardType="email-address"
                  error={errors.email && errors.email}
                  touch={touched.email}
                />
                <FormField
                  title="Password"
                  value={values.password}
                  otherStyles="mt-7"
                  handleChangeText={handleChange("password")}
                  error={errors.password && errors.password}
                  touch={touched.password}
                />
                <CustomButton
                  title="Create"
                  handlePress={handleSubmit}
                  containerStyles="mt-7"
                  isLoading={isSubmitting}
                />
              </>
            )}
          </Formik>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-sm text-secondary font-psemibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
