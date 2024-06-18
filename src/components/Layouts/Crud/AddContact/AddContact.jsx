import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "./AddContact.css";
import { useDispatch, useSelector } from "react-redux";
import { createContact,getDataInfo } from "../../../../Redux/Reducer/GetDataSlice";
import { toast } from "react-toastify";

function AddContact({ closeModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { currentPage, pageSize, searchQuery } = useSelector(
    (state) => state.data
  );
  const [imagePreview, setImagePreview] = useState(null);
  const watchedImage = watch("image");

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

    dispatch(createContact(formData))
      .then(() => {
        dispatch(getDataInfo({ searchQuery, currentPage, pageSize }));
        closeModal();
        toast.success("Contact created successfully!");
      })
      .catch((error) => {
        console.error("Error creating contact:", error);
      });
  };

  return (
    <>
      <div className="AddForm">
        <div className="closeFrom">
          <button className="close_btn" onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="FormSection">
          <div className="heading">
            <h2>Add Contact</h2>
          </div>
          <div className="formContainer">
            <form id="formSection" onSubmit={handleSubmit(onSubmit)}>
              <div className="FormContent">
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onchange } }) => (
                    <div className="imageInput">
                      <div
                        className={`avatar ${
                          !getValues("image") ? "empty" : ""
                        }`}
                      >
                        <label htmlFor="image">
                          <h4>Image</h4>
                        </label>
                        <input
                          type="file"
                          id="image"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            onchange(file);
                            setValue("image", file);
                          }}
                          {...register("image", {
                            required: "Image is required",
                          })}
                          hidden
                        />
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="New Contact"
                            className="ImagePreview"
                          />
                        ) : (
                          <div className="defaultImage"></div>
                        )}
                        <label htmlFor="image" className="addImage">
                          Add
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
                        pattern: {
                          value: /^[A-Za-z]+$/,
                          message: "Invalid Name Format",
                        },
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
                        pattern: {
                          value: /^[A-Za-z]+$/,
                          message: "Invalid Number format",
                        },
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
                  {...register("email", {
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email format",
                    },
                    required: "Email is required",
                  })}
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
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid Number format",
                    },
                    required: "Phone Number is required",
                  })}
                ></input>
                <p className="error">{errors.phone?.message}</p>
              </div>
              <div className="formSubmit">
                <button className="btn add" type="submit">
                  Submit
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

export default AddContact;
