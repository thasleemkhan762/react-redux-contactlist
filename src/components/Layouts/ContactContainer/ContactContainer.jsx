import React, { useEffect, useState } from "react";
import "./ContactContainer.css";
import { getDataInfo } from "../../../Redux/Reducer/GetDataSlice";
import { useSelector } from "react-redux";
import ContactForm from "../Crud/AddContact/ContactForm";
import DeleteContact from "../Crud/DeleteContact/DeleteContact";

const ContactContainer = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const searchData = useSelector((state) => state.data.data);
  
  const { data, loading, error, currentPage, pageSize, searchQuery } =
    useSelector((state) => state.data);
    

  useEffect(() => {
    if (searchQuery !== "" || currentPage !== 1 || pageSize !== 5) {
      getDataInfo({ searchQuery, currentPage, pageSize });
    }
  }, [searchQuery, currentPage, pageSize]);

  return (
    <div className="page_content_section_table">
      <table>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((contact, index) => (
              <tr key={contact._id}>
                <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                <td>
                  <div className="profile">
                    <img
                      src={`https://react-redux-contactlist-backend.onrender.com/${contact.image}`}
                      alt=""
                    />
                    {`${contact.firstName} ${contact.lastName}`}
                  </div>
                </td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>
                  <div className="contact_action">
                    <button
                      className="contact_btn edit_btn"
                      onClick={() => setEditModalOpen(contact._id)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className="contact_btn delete_btn"
                      onClick={() => setDeleteModalOpen(contact._id)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="message">
        {searchData.length === 0 && <p>No data found</p>}
        {loading && <div className="loading">Loading ...</div>}
        {error && <div className="error"> {error} </div>}
      </div>
      {editModalOpen && (
        <ContactForm
          editModalClose={() => setEditModalOpen(false)}
          contactId={editModalOpen}
        />
      )}
      {deleteModalOpen && (
        <DeleteContact
          deleteModalClose={() => setDeleteModalOpen(false)}
          contactId={deleteModalOpen}
        />
      )}
    </div>
  );
};

export default ContactContainer;
