import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./global";

export default function SellBike() {
  const [formdata, setFormdata] = useState({
    Sellbrand: "",
    Sellmodel: "",
    Sellyear: "",
    Sellkm: "",
    SellImage1: "",
    SellImage2: "",
    SellImage3: "",
    SellImage4: "",
    OwnerORSeller: "",
    SellName: "",
    Email: "",
    Mobile: "",
    Location: "",
  });
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleFileInputChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("sampleFile", file);
    try {
      setLoading(true); // Set loading to true when upload starts
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = response.data.link;
      console.log(imageUrl);
      setFormdata({
        ...formdata,
        [`SellImage${index}`]: imageUrl,
      });
      setLoading(false); // Set loading to false after successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Profile Picture Upload Failed. Please try again.");
      setLoading(false); // Set loading to false if upload fails
    }
  };

  useEffect(() => {
    console.log(formdata);
  }, [formdata]);

  return (
    <div>
      {/* Your JSX content */}
      <input type="file" onChange={(e) => handleFileInputChange(e, 1)} />
      <input type="file" onChange={(e) => handleFileInputChange(e, 2)} />
      <input type="file" onChange={(e) => handleFileInputChange(e, 3)} />
      <input type="file" onChange={(e) => handleFileInputChange(e, 4)} />
      {/* Other input fields */}
    </div>
  );
}

// import { useState } from "react";
// import axios from "axios";
// import API_URL from "./global";

// export default function SellBike() {
//   const [formdata, setFormdata] = useState({
//     Sellbrand: "",
//     Sellmodel: "",
//     Sellyear: "",
//     Sellkm: "",
//     SellImages: Array.from({ length: 10 }, () => ""),
//     OwnerORSeller: "",
//     SellName: "",
//     Email: "",
//     Mobile: "",
//     Location: "",
//   });

//   const handleFileupload = async (file, index) => {
//     if (!file) {
//       alert("Please select an image to upload.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("sampleFile", file);
//     try {
//       const response = await axios.post(`${API_URL}/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       const imageUrl = response.data.link;
//       console.log(index, imageUrl);
//       return imageUrl;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Profile Picture Upload Failed. Please try again.");
//       return null;
//     }
//   };

//   const handleFileInputChange = async (e, index) => {
//     const file = e.target.files[0];
//     const imageUrl = await handleFileupload(file, index);
//     setFormdata((prevState) => ({
//       ...prevState,
//       SellImages: prevState.SellImages.map((url, i) =>
//         i === index ? imageUrl : url
//       ),
//     }));
//   };
//   console.log(formdata);

//   return (
//     <div>
//       <div>
//         <div>
//           <div className="sellpagedivflexcontenet">
//             <div className="sellpagedivwidthmaindiv">
//               {/* <!------------------------------About Section---------------------------> */}
//               <div className="sellourBikeaboutsection">
//                 <img src="/images/SellPageImage.png" alt="" />
//                 <div className="sellourBikeaboutsectioncontent">
//                   <div className="sellourBikeaboutheading">Sell your Bike</div>
//                   <div className="sellourBikeaboutparagraph">
//                     " RevNitro classNameified is your trusted destination for
//                     selling pre-owned motorbikes. With our secure and
//                     user-friendly platform, we make it easy to find the right
//                     buyer for your bike. Simply leave your bike with us at Pro
//                     Street, where our expert team conducts thorough inspections
//                     and facilitates the sale based on the vehicle's condition.
//                     We prioritize transparency and reliability, ensuring a
//                     seamless experience for both sellers and buyers."
//                   </div>
//                 </div>
//               </div>
//               {/* <!-------------------------------About Section--------------------------->
//           <!------------------------------------Upload Section---------------------------------> */}

//               <div className="sellourBikesellerbikeuploadsection">
//                 <div className="sellourheadingforbikeselling">
//                   Give details of your bike
//                 </div>
//                 <div className="sellourinputformsellerbike">
//                   <div className="sellourinbackgroundwhitediv">
//                     <div className="sellourisellerbikedeatils">
//                       Bike Details
//                     </div>

//                     <form
//                       // onSubmit={handleSubmit}

//                       action=""
//                     >
//                       {/* <!----------------------DropDown--------------------------> */}
//                       <div className="selectdropdownflex">
//                         <div>
//                           <input
//                             className="Brandname"
//                             type="text"
//                             placeholder="Brand"
//                             value={formdata.Sellbrand}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Sellbrand: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>

//                         <div>
//                           <input
//                             className="bikemodel"
//                             type="text"
//                             placeholder="Model"
//                             value={formdata.Sellmodel}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Sellmodel: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="bikeyearsaz"
//                             type="text"
//                             placeholder="Year"
//                             value={formdata.Sellyear}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Sellyear: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="kilometerinput"
//                             placeholder="Kilometre"
//                             type="text"
//                             name="kilometer"
//                             value={formdata.Sellkm}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Sellkm: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {/* <!----------------------DropDown -------------------------->

//                   <!-----------------------Bike Document------------------------> */}
//                       <div className="sellourisellerbikedeatils">
//                         Bike Document
//                       </div>

//                       {/* <!----------------------------RC Deatils----------------------------> */}

//                       <div className="sellouruploadrcbook">
//                         Upload RC Book Photocopies
//                       </div>

//                       <div className="sellourrcbookflex">
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input1"
//                               id="file-input1"
//                               className="file-input__input"
//                               onChange={
//                                 (e) => handleFileInputChange(e, "SellImage1") // Index dynamically determined
//                               }
//                             />

//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input2"
//                               id="file-input2"
//                               className="file-input__input"
//                               onChange={
//                                 (e) => handleFileInputChange(e, "SellImage2") // Index dynamically determined
//                               }
//                             />

//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input3"
//                               id="file-input3"
//                               className="file-input__input"
//                               onChange={
//                                 (e) => handleFileInputChange(e, "SellImage3") // Index dynamically determined
//                               }
//                             />

//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       {/* <!----------------------------RC Deatils---------------------------->

//                   <!----------------------------Insurance Deatils----------------------------> */}
//                       <div className="sellouruploadrcbook">
//                         Upload Bike Insurance Photocopies
//                       </div>

//                       <div className="sellourrcbookflex">
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               onChange={(e) => {
//                                 handleFileInputChange(e, "SellImage4");
//                               }}
//                             />

//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               onChange={(e) => {
//                                 handleFileInputChange(e, "SellImage5");
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               value={formdata.SellImage6}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setFormdata({
//                                   ...formdata,
//                                   SellImage6: handleFileupload(file),
//                                 });
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>

//                       {/* <!----------------------------Insurance Deatils---------------------------->
//                   <!----------------------------Video Deatils----------------------------> */}
//                       <div className="sellouruploadrcbook">
//                         Upload Bike Video with Owner
//                       </div>

//                       <div className="sellourrcbookflex">
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               value={formdata.SellImage7}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setFormdata({
//                                   ...formdata,
//                                   SellImage7: handleFileupload(file),
//                                 });
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               value={formdata.SellImage8}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setFormdata({
//                                   ...formdata,
//                                   SellImage8: handleFileupload(file),
//                                 });
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>

//                       {/* <!----------------------------Video Deatils---------------------------->

//                   <!----------------------------Bike Images Deatils----------------------------> */}
//                       <div className="sellouruploadrcbook">
//                         Upload Bike Images
//                       </div>

//                       <div className="sellourrcbookflex">
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               value={formdata.SellImage9}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setFormdata({
//                                   ...formdata,
//                                   SellImage9: handleFileupload(file),
//                                 });
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="sellouraddphotosupload">
//                           <div className="file-input">
//                             <input
//                               type="file"
//                               name="file-input"
//                               id="file-input"
//                               className="file-input__input"
//                               value={formdata.SellImage10}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setFormdata({
//                                   ...formdata,
//                                   SellImage10: handleFileupload(file),
//                                 });
//                               }}
//                             />
//                             <label
//                               className="file-input__label"
//                               htmlFor="file-input"
//                             >
//                               <img
//                                 src="./images/SelllnfUploadiMage.png"
//                                 alt=""
//                               />
//                               <span className="uploadimagecreatepost"></span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       {/* <!----------------------------Bike Images Deatils---------------------------->

//                   <!-----------------------Bike Document------------------------>

//                   <!--------------------------Owner Deatils-----------------------------------------> */}
//                       <div className="sellourisellerbikedeatils1">
//                         Owner Details
//                       </div>
//                       <div className="sellourOwnerDeatils">
//                         Ownership &nbsp;or&nbsp; Seller
//                       </div>

//                       <div className="sellourownerdeatilsflex">
//                         <div>
//                           <input
//                             type="text"
//                             className="sellourowneBrandname1"
//                             placeholder="OwnerShip"
//                             value={formdata.OwnerORSeller}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 OwnerORSeller: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="sellourNameoftheOwner"
//                             placeholder="Name*"
//                             type="text"
//                             name="Name*"
//                             value={formdata.SellName}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 SellName: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="sellourNameoftheOwner"
//                             placeholder="Email Id*"
//                             type="email"
//                             name="Email"
//                             value={formdata.Email}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Email: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="sellourNameoftheOwner"
//                             placeholder="Mobile No*"
//                             type="text"
//                             name="Mobile"
//                             value={formdata.Mobile}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Mobile: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <input
//                             className="sellourNameoftheOwner"
//                             placeholder="Location*"
//                             type="text"
//                             name="Location"
//                             value={formdata.Location}
//                             onChange={(e) => {
//                               setFormdata({
//                                 ...formdata,
//                                 Location: e.target.value,
//                               });
//                             }}
//                           />
//                         </div>

//                         <div className="sellourownwersubmit">
//                           <button>Submit</button>
//                         </div>
//                       </div>
//                     </form>

//                     {/* <!--------------------------Owner Deatils-----------------------------------------> */}
//                   </div>
//                 </div>
//               </div>
//               {/* <!------------------------------------Upload Section---------------------------------> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
