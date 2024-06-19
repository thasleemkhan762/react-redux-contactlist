import React, { useState, useEffect } from "react";
import Header from "../../Common/Header/Header";
import "./MainLayout.css";
import ContactContainer from "../ContactContainer/ContactContainer";
import ContactForm from "../Crud/AddContact/ContactForm";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataInfo,
  setCurrentPage,
  setPageSize,
} from "../../../Redux/Reducer/GetDataSlice";

const MainLayout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentPage, totalPages, pageSize } = useSelector(
    (state) => state.data
  );
  const searchQuery = "";
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataInfo({ searchQuery, currentPage, pageSize }));
  }, [searchQuery, currentPage, pageSize, dispatch]);

  const handleSearchChange = (e) => {
    const newSearchQuery = e.target.value;
    dispatch(
      getDataInfo({ searchQuery: newSearchQuery, currentPage: 1, pageSize })
    );
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    const newTotalPages = Math.ceil(totalPages / newSize);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(newCurrentPage));
  };

  const pageNumbers = Array.from(
    { length: Math.ceil(totalPages / pageSize) },
    (_, numBtn) => numBtn + 1
  );

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  return (
    <>
      <div className="MainPage">
        <div className="container">
          <div className="Main_Heading">
            <Header name={"Contact List"} />
          </div>
          <div className="contactPage">
            
            <div className="subSection">
              <div className="ShowList">
                <h5>Show</h5>
                <select
                  name="contact"
                  id="showList"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <h5>entries</h5>
                <p>of {totalPages}</p>
              </div>
              <div className="addContactBtn">
              <button className="addBtn" onClick={() => setModalOpen(true)}>
                <span className="material-symbols-outlined"> add</span>
                <h4>Add contact</h4>
              </button>
            </div>
              <div className="search_box">
                <input
                  type="text"
                  placeholder="Search Contacts"
                  onChange={handleSearchChange}
                />
                <span className="material-symbols-outlined search-icon">search</span>
              </div>
            </div>
            <ContactContainer />
            <div className="pagination_container">
            <div className="pagination">
              <button
                className="paginate_btn"
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;{" "}
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handleChangePage(pageNumber)}
                  className={`${pageNumber === currentPage ? "active" : ""}`}>
                    {pageNumber}
                  </button>
              ))}

              <button className="paginate_btn" onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage >= Math.ceil(totalPages/pageSize)}>
                &raquo;</button>
            </div>
            </div>
          </div>
          {modalOpen && (
            <ContactForm
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
