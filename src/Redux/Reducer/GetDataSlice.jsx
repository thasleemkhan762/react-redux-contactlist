import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// get all contacts
export const getDataInfo = createAsyncThunk('getDataInfo', async ({ searchQuery, currentPage, pageSize }) => {
    try {
        const response = await axios.get(`https://react-redux-contactlist-backend.vercel.app/api/contacts/?searchQuery=${searchQuery}&currentPage=${currentPage}&pageSize=${pageSize}`,);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Create contact
export const createContact = createAsyncThunk('createContact', async (data) => {
    try {
        const response = await axios.post('http://localhost:5001/api/contacts', data);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// id fetch
export const getContactById = createAsyncThunk("getContactId", async (id) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

// edit contact
export const editContact = createAsyncThunk("editContact", async ({ id, data }) => {
  try {
    const response = await axios.put(`http://localhost:5001/api/contacts/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
});

//delete contact
export const deleteContact = createAsyncThunk("deleteContact", async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5001/api/contacts/${id}`);
    console.log(response.data);
    return id;
  } catch (error) {
    throw error;
  }
});




const getData = createSlice({
    name: 'data',
    initialState: {
        data: [],
        error: '',
        loading: false,
        currentPage: 1,
        pageSize: 5,
        totalPages: 0,
        searchQuery: '',
    },
    reducers: {
      setCurrentPage: (state, action) => {
        state.currentPage = action.payload;
      },
      setPageSize: (state, action) => {
        state.pageSize = action.payload;
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(getDataInfo.pending, (state) => {
            state.loading = true;
            state.error = "";
          })
          .addCase(getDataInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.contacts;
            state.totalPages = action.payload.totalPages;
          })
          .addCase(getDataInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = "Some error occured";
          })

          // create contact
          .addCase(createContact.pending, (state) => {
            state.loading = true;
          })
          .addCase(createContact.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(createContact.rejected, (state, action) => {
            state.loading = false;
            state.error = "Some error occurred";
          })

          // delete contact
          .addCase(deleteContact.pending, (state) => {
            state.loading = true;
            state.error = "";
          })
          .addCase(deleteContact.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter(
              (contact) => contact._id !== action.payload
            );
          })
          .addCase(deleteContact.rejected, (state, action) => {
            state.loading = false;
            state.error = "Some error occurred";
          })

          // Contcat Id fetch
          .addCase(getContactById.fulfilled, (state, action) => {
            state.loading = false;
          })

          // Edit contact
          .addCase(editContact.pending, (state) => {
            state.loading = true;
          })
          .addCase(editContact.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(editContact.rejected, (state, action) => {
            state.loading = false;
            state.error = "Some error occurred";
          });

    },
});


export const { setCurrentPage, setPageSize } = getData.actions;

export default getData.reducer;