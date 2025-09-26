import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "../Pages/DashBoard/DashBoard";
import AdminLogin from "../Pages/AdminLogin/AdminLogin";
import AddCategory from "../Pages/Category/AddCategory";
import ListCategory from "../Pages/Category/ListCategory";
import AddSubCategory from "../Pages/SubCategory/AddSubCategory";
import ListSubCategory from "../Pages/SubCategory/ListSubCategory";
import AddSubadmin from "../Pages/Subadmin/AddSubadmin";
import ListSubadmin from "../Pages/Subadmin/ListSubadmin";
import Profile from "../Pages/Profile/Profile";
import ChangePassword from "../Pages/Profile/ChangePassword";
import Role from "../Pages/Subadmin/Role";
import NewSupplierRequest from "../Pages/SupplierRequest/newSupplierRequest/NewSupplierRequest";
import InactiveSuppliers from "../Pages/SupplierRequest/InactiveSuppliers/InactiveSuppliers";
import ActiveSuppliers from "../Pages/SupplierRequest/ActiveSuppliers/ActiveSuppliers";
import SupplierRegistrationForm from "../Pages/SupplierRequest/SupplierRegistrationForm/SupplierRegistrationForm";
import NewTender from "../Pages/TenderCollections/NewTenders/NewTender";
import ListTender from "../Pages/TenderCollections/PublishTenders/ListTender";
import Tenderdetails from "../Pages/TenderCollections/PublishTenders/Tenderdetails";
import InterestReceived from "../Pages/TenderCollections/InterestReceived/InterestReceived";
import QuotationReceived from "../Pages/TenderCollections/QuotationReceived/QuotationReceived";
import ListallTenders from "../Pages/SupplierTenderList/ListAllTenders/ListallTenders";
import CompanyProfile from "../Pages/SupplierTenderList/CompanyProfile/CompanyProfile";
import PendingTenders from "../Pages/SupplierTenderList/PendingReview/PendingTenders";
import ApprovedTenders from "../Pages/SupplierTenderList/ApprovedTenders/ApprovedTenders";
import RejectedTenders from "../Pages/SupplierTenderList/RejectedTenders/RejectedTenders";
import SupplierReport from "../Pages/Reports/SupplierReport/SupplierReport";
import TenderReport from "../Pages/Reports/TenderReport/TenderReport";
import DraftTender from "../Pages/TenderCollections/DraftTender/DraftTender";
import DraftView from "../Pages/TenderCollections/DraftTender/DraftView";
import PurchaseOrder from "../Pages/Purchase/PurchaseOrder/PurchaseOrder";
import PurchaseRequest from "../Pages/Purchase/PurchaseRequest/PurchaseRequest";
import CompareQuotations from "../Pages/TenderCollections/QuotationReceived/CompareQuotations";
import SelectedQuotationView from "../Pages/TenderCollections/QuotationReceived/SelectedQuotationView";
import MyQuotations from "../Pages/SupplierTenderList/MyQuotations/MyQuotations";

function Dom() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/listCategory" element={<ListCategory />} />
          <Route path="/addsubCategory" element={<AddSubCategory />} />
          <Route path="/listsubCategory" element={<ListSubCategory />} />

          <Route path="/addSubadmin" element={<AddSubadmin />} />
          <Route path="/listSubadmin" element={<ListSubadmin />} />
          <Route path="/role" element={<Role />} />

          <Route
            path="/SupplierRegistration"
            element={<SupplierRegistrationForm />}
          />
          <Route path="/newSupplierRequest" element={<NewSupplierRequest />} />
          <Route path="/activeSuppliers" element={<ActiveSuppliers />} />
          <Route path="/inactiveSuppliers" element={<InactiveSuppliers />} />
          <Route path="/listalltenders" element={<ListallTenders />} />
          <Route path="/CompanyProfile" element={<CompanyProfile />} />
          <Route path="/supplierreport" element={<SupplierReport />} />
          <Route path="/tenderreport" element={<TenderReport />} />


          <Route path="/newtender" element={<NewTender />} />
          <Route path="/DraftTender" element={<DraftTender />} />
          <Route path="/draft-view/:id" element={<DraftView />} />
          <Route path="/listTender" element={<ListTender />} />
          <Route path="/pendingTender" element={<PendingTenders />} />
          <Route path="/approvedTender" element={<ApprovedTenders />} />
          <Route path="/rejectTender" element={<RejectedTenders />} />
          <Route path="/myQuotations" element={<MyQuotations />} />

         

          <Route path="/tender-details/:id" element={<Tenderdetails />} />
          <Route path="/interestReceived" element={<InterestReceived />} />
          <Route path="/quotationReceived" element={<QuotationReceived />} />
          <Route path="/compareQuotation" element={<CompareQuotations />} />
          <Route path="/selectedQuotationView" element={<SelectedQuotationView />} />


          <Route path="/purchaseOrder" element={<PurchaseOrder />} />
          <Route path="/purchaseRequest" element={<PurchaseRequest />} />


          <Route path="/Profile" element={<Profile />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Dom;
