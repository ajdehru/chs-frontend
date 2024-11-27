import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS, STORAGE } from "../../constants";
import { setLocalStorage } from "../../helpers/storage";

// MARK: Login API
export const loginUser = createAsyncThunk("loginUser", async (credentials) => {
  try {
    const response = await axiosInstance.post(
      ENDPOINTS.USER.LOGIN,
      credentials
    );
    setLocalStorage(STORAGE.USER_KEY, response.data?.data);
    return response.data;
  } catch (error) {
    alert(error.response?.data?.message);
    console.log("Login Error:", error.response?.data?.message);
  }
});

// MARK: Registration API
export const registerUser = createAsyncThunk(
  "registerUser",
  async (credentials) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.USER.REGISTER,
        credentials
      );
      return response.data;
    } catch (error) {
      console.log("Registration Error:", error.response?.data);
      throw error;
    }
  }
);

// MARK: User Profile API
export const userProfile = createAsyncThunk("userProfile", async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.USER.GET_PROFILE);
    return response.data.data;
  } catch (error) {
    console.log("User Profile Error:", error.response?.data);
    throw error;
  }
});

// MARK: Change Profile Pic API
export const changeProfilePic = createAsyncThunk(
  "changeProfilePic",
  async (data) => {
    try {
      const response = await axiosInstance.put(
        ENDPOINTS.USER.CHANGE_PROFILE_PICTURE,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Change Profile Pic Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

const initialState = {
  data: {
    user: {
      loginResult: [],
      registerResult: [],
      userProfileResult: [],
      changeProfilePicResult: [],
    },
  },
  loading: {
    user: {
      loginLoading: false,
      registerLoading: false,
      userProfileLoading: false,
      changeProfilePicLoading: false,
    },
  },
  error: {
    user: {
      loinError: "",
      registerError: "",
      changeProfilePicError: "",
    },
  },
};

const userApiSlice = createSlice({
  name: "userApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MARK: Login User
      .addCase(loginUser.pending, (state) => {
        state.loading.user.loginLoading = true;
        state.error.user.loinError = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.user.loginLoading = false;
        state.data.user.loginResult = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.user.loginLoading = false;
        state.error.user.loinError = action.error.message || "Login failed!";
      })
      // MARK: Register User
      .addCase(registerUser.pending, (state) => {
        state.loading.user.registerLoading = true;
        state.error.user.registerError = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.user.registerLoading = false;
        state.data.user.registerResult = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.user.registerLoading = false;
        state.error.user.registerError =
          action.error.message || "Registration failed!";
      })
      // MARK: Get User Profile
      .addCase(userProfile.pending, (state) => {
        state.loading.user.userProfileLoading = true;
        state.error.user.userProfileError = "";
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading.user.userProfileLoading = false;
        state.data.user.userProfileResult = action.payload;
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading.user.userProfileLoading = false;
        state.error.user.userProfileError =
          action.error.message || "User profile fetch failed!";
      })
      // MARK: Change Profile Pic
      .addCase(changeProfilePic.pending, (state) => {
        state.loading.user.changeProfilePicLoading = true;
        state.error.user.changeProfilePicError = "";
      })
      .addCase(changeProfilePic.fulfilled, (state, action) => {
        state.loading.user.changeProfilePicLoading = false;
        state.data.user.changeProfilePicResult = action.payload;
      })
      .addCase(changeProfilePic.rejected, (state, action) => {
        state.loading.user.changeProfilePicLoading = false;
        state.error.user.changeProfilePicError =
          action.error.message || "Change profile pic failed!";
      });
  },
});

export default userApiSlice.reducer;