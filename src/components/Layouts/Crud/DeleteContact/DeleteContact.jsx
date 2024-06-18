import React from 'react'
import{ useDispatch, useSelector } from 'react-redux'
import { deleteContact } from '../../../../Redux/Reducer/GetDataSlice';
import { getDataInfo } from '../../../../Redux/Reducer/GetDataSlice'
import { toast } from 'react-toastify'
import "./DeleteContact.css"

function DeleteContact({deleteModalClose, contactId}) {
  const dispatch = useDispatch();
  const { currentPage, pageSize, searchQuery } = useSelector((state) => state.data);

  const deleteBtn = async () => {
    try {
      await dispatch(deleteContact(contactId));
      
      dispatch(getDataInfo({ searchQuery, currentPage, pageSize }));
      deleteModalClose();
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }
  return (
    <>
      <div className="DeleteForm">
        <div className="closeFrom">
            <button className="close_btn" onClick={deleteModalClose}>
            <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div className="deleteFormSection">
            <div className="deleteHeading">
                <h2>Delete Contact</h2>
                
            </div>
            <p className="paragraph">Are you sure you want to delete this contact ?</p>
            <div className="formSubmit">
                <button type='submit' className='btn delete' onClick={deleteBtn}>
                    Delete
                </button>
            </div>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  )
}

export default DeleteContact
