import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  editContact,
  getContactById,
  getDataInfo,
} from "../../../../Redux/Reducer/GetDataSlice";
import { toast } from "react-toastify";
import "./AddContact.css";

function ContactForm({ closeModal, contactId, editModalClose }) {
  const dispatch = useDispatch();
  const { currentPage, pageSize, searchQuery } = useSelector((state) => state.data);
  const { register, handleSubmit, setValue, watch, control, formState: { errors }, } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const watchedImage = watch("image");

  useEffect(() => {
    if (contactId) {
      const fetchContactData = async () => {
        try {
          const actionResult = await dispatch(getContactById(contactId));
          const contactData = actionResult.payload;
          if (contactData) {
            setValue("firstName", contactData.firstName || "");
            setValue("lastName", contactData.lastName || "");
            setValue("email", contactData.email || "");
            setValue("phone", contactData.phone || "");
            setImagePreview(`https://react-redux-contactlist-backend.onrender.com/${contactData.image}`);
          }
        } catch (error) {
          console.error("Error fetching contact data:", error);
        }
      };
      fetchContactData();
    }
  }, [contactId, dispatch, setValue]);

  useEffect(() => {
    if (watchedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (watchedImage[0] instanceof File) {
        reader.readAsDataURL(watchedImage[0]);
      }
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    try {
      if (contactId) {
        await dispatch(editContact({ id: contactId, data: formData }));
        toast.success("Contact updated successfully!");
        editModalClose();
      } else {
        await dispatch(createContact(formData));
        toast.success("Contact created successfully!");
        closeModal();
      }

      dispatch(getDataInfo({ searchQuery, currentPage, pageSize }));
      
      
    } catch (error) {
      console.error(
        contactId ? "Error updating contact:" : "Error creating contact:",
        error
      );
      toast.error(
        contactId
          ? "Error updating contact. Please try again."
          : "Error creating contact. Please try again."
      );
    }
  };

  return (
    <>
      <div className="AddForm">
        <div className="closeFrom">
          <button className="close_btn" onClick={closeModal || editModalClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="FormSection">
          <div className="heading">
            <h2>{contactId ? "Edit Contact" : "Add Contact"}</h2>
          </div>
          <div className="formContainer">
            <form id="formSection" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="FormContent">
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <div className="imageInput">
                      <div className="avatar">
                        <label htmlFor="image">
                          <h4>Image</h4>
                        </label>
                        <input
                          type="file"
                          id="image"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            onChange(file);
                          }}
                          {...register("image", {
                            required: !contactId && "Image is required",
                          })}
                          hidden
                        />
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="ImagePreview"
                          />
                        ) : (
                          !contactId && <div className="defaultImage"></div>
                        )}
                        <label htmlFor="image" className="addImage">
                          {contactId ? "Change" : "Add"}
                        </label>
                        <p className="error">{errors.image?.message}</p>
                      </div>
                    </div>
                  )}
                />
                <div className="name_box">
                  <div>
                    <label htmlFor="firstName">
                      <h4>First Name:</h4>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="inputBox name"
                      placeholder="Enter First Name"
                      {...register("firstName", {
                        required: "First Name is required",
                      })}
                    />
                    <p className="error">{errors.firstName?.message}</p>
                  </div>
                  <div>
                    <label htmlFor="lastName">
                      <h4>Last Name:</h4>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="inputBox name"
                      placeholder="Enter Last Name"
                      {...register("lastName", {
                        required: "Last Name is required",
                      })}
                    />
                    <p className="error">{errors.lastName?.message}</p>
                  </div>
                </div>
                <label htmlFor="email">
                  <h4>Email:</h4>
                </label>
                <input
                  type="email"
                  id="email"
                  className="inputBox"
                  placeholder="Enter email"
                  {...register("email", { required: "Email is required" })}
                />
                <p className="error">{errors.email?.message}</p>
                <label htmlFor="phone">
                  <h4>Phone Number:</h4>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="inputBox"
                  placeholder="Enter phone number"
                  {...register("phone", {
                    required: "Phone Number is required",
                  })}
                />
                <p className="error">{errors.phone?.message}</p>
              </div>
              <div className="formSubmit">
                <button className="btn add" type="submit">
                  {contactId ? "Save Changes" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
}

export default ContactForm;
