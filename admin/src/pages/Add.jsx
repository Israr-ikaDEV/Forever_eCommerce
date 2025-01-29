import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { serverURL } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const handleImageChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const toggleSize = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestseller);
    formData.append("sizes", JSON.stringify(sizes));

    try {
      const res = await axios.post(serverURL + "/api/product/add", formData, {
        headers: { token },
      });

      if (res.data.success) {
        // Reset the form fields
        setName("");
        setDescription("");
        setPrice(0);
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestseller(false);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding product");
    }
  };

  return (
    <main>
      <form onSubmit={handleAddProduct} className="flex flex-col w-full items-start gap-3">
        <div>
          <p className="mb-2 font-medium text-sm">Upload Images</p>
          <div className="flex gap-2">
           
          <label htmlFor="image1">
                <img className="w-20" src={ !image1?assets.upload_area:URL.createObjectURL(image1)} alt="" />
                <input  onChange={(e)=>setImage1(e.target.files[0])}type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2">
                <img className="w-20" src={ !image2?assets.upload_area:URL.createObjectURL(image2)} alt="" />
                <input  onChange={(e)=>setImage2(e.target.files[0])}type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3">
                <img className="w-20" src={ !image3?assets.upload_area:URL.createObjectURL(image3)} alt="" />
                <input  onChange={(e)=>setImage3(e.target.files[0])}type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4">
                <img className="w-20" src={ !image4?assets.upload_area:URL.createObjectURL(image4)} alt="" />
                <input  onChange={(e)=>setImage4(e.target.files[0])}type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Name</p>
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Description</p>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Write product description"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Product Category</p>
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-3 py-2"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product SubCategory</p>
            <select
              name="subCategory"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-3 py-2"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product Price</p>
            <input
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full max-w-[500px] px-3 py-2"
              type="number"
              placeholder="25$"
              required
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium text-sm ">Product Sizes</p>
          <div className="flex gap-2.5">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size}>
                <p
                  className={`cursor-pointer font-semibold  py-1 px-3 ${
                    sizes.includes(size) ? "bg-pink-300" : "bg-slate-200"
                  }`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            name="bestseller"
            onChange={(e) => setBestseller(e.target.checked)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button className="uppercase bg-black text-white px-3 py-3 rounded" type="submit">
          Add Product
        </button>
      </form>
    </main>
  );
};

export default Add;
