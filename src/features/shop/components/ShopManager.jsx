import { useState, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { PhonePreview } from "../../editor/components/PhonePreview";
import { useProfile } from "../../../hooks/useProfile";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ShoppingBag,
  X,
  Check,
  Loader2,
  Eye,
  DollarSign,
  Link as LinkIcon,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Switch } from "../../../components/ui/Switch";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function ShopManager() {
  const {
    products,
    loading,
    addProduct,
    deleteProduct,
    toggleProductActive,
    uploadProductImage,
  } = useProducts();
  const { profile } = useProfile();

  const [isAdding, setIsAdding] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const fileInputRef = useRef(null);

  // Handle Image Selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      toast.error("Title and Link are required");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = null;

      if (newImage) {
        imageUrl = await uploadProductImage(newImage);
      }

      await addProduct({
        title: newTitle,
        price: newPrice,
        product_url: newUrl,
        image_url: imageUrl,
      });

      toast.success("Product added!");
      // Reset Form
      setNewTitle("");
      setNewPrice("");
      setNewUrl("");
      setNewImage(null);
      setPreviewImg(null);
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shop</h1>
          <p className="text-slate-500 mt-1">Showcase your products.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: PRODUCT MANAGER */}
        <div className="xl:col-span-2 space-y-6">
          {/* SLIDE DOWN FORM */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-6 border-indigo-100 bg-indigo-50/30 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-indigo-900">
                      Add New Product
                    </h3>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="bg-white p-1 rounded-full text-slate-400 hover:text-slate-700 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row gap-6"
                  >
                    {/* Image Upload Box */}
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="w-full md:w-32 h-32 bg-white rounded-xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors shrink-0 overflow-hidden relative group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                      {previewImg ? (
                        <>
                          <img
                            src={previewImg}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="text-indigo-300 mb-1" />
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">
                            Image
                          </span>
                        </>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Product Title
                          </label>
                          <Input
                            placeholder="e.g. My E-Book"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Price
                          </label>
                          <div className="relative">
                            <DollarSign
                              size={14}
                              className="absolute left-3 top-3 text-slate-400"
                            />
                            <Input
                              className="pl-8"
                              placeholder="10.00"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Product URL
                        </label>
                        <div className="relative">
                          <LinkIcon
                            size={14}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <Input
                            className="pl-8"
                            placeholder="https://gumroad.com/..."
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          disabled={uploading}
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
                        >
                          {uploading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Check size={16} />
                          )}{" "}
                          Save Product
                        </button>
                      </div>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUCT LIST */}
          <div className="grid grid-cols-1 gap-4">
            {products.length === 0 && !isAdding ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <ShoppingBag
                  size={40}
                  className="mx-auto text-slate-300 mb-3"
                />
                <h3 className="font-bold text-slate-900">No products yet</h3>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-indigo-600 font-bold hover:underline text-sm"
                >
                  Add your first product
                </button>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id} // MONGODB FIX: Using _id
                  product={product}
                  onDelete={() => deleteProduct(product._id)} // MONGODB FIX: Using _id
                  onToggle={(val) => toggleProductActive(product._id, val)} // MONGODB FIX: Using _id
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="hidden xl:block sticky top-8">
          <PhonePreview profile={profile} />
        </div>
      </div>

      {/* ✅ 1. COMPACT PREVIEW BUTTON (Circular FAB) */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 bg-slate-900 text-white p-3.5 rounded-full shadow-2xl z-40 hover:scale-110 hover:bg-slate-800 transition-all active:scale-90"
        aria-label="Preview"
      >
        <Eye size={24} />
      </button>

      {/* ✅ 2. MODAL WITH CLOSE BUTTON AT BOTTOM */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in">
          {/* Content Area - Pushed to Bottom */}
          <div className="relative flex-1 w-full flex flex-col items-center justify-end overflow-hidden pb-2">
            <div
              onClick={(e) => e.stopPropagation()}
              className="scale-80 origin-bottom"
            >
              <PhonePreview profile={profile} />
            </div>
          </div>

          {/* Close Button - At Bottom */}
          <button
            onClick={() => setPreviewOpen(false)}
            className="flex items-center gap-0 bg-white/10 text-white px-2 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xl transition-all hover:bg-white/20 active:scale-95 mb-2 shrink-0"
          >
            <X size={20} /> Close Preview
          </button>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: PRODUCT CARD ---
function ProductCard({ product, onDelete, onToggle }) {
  return (
    <Card
      className={`p-3 flex items-center gap-4 border transition-all ${
        product.is_active
          ? "border-slate-200 bg-white"
          : "border-slate-100 bg-slate-50 opacity-75"
      }`}
    >
      {/* Image Thumbnail */}
      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-bold text-slate-900 truncate">{product.title}</h4>
          {product.price && (
            <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md border border-green-100">
              {product.price}
            </span>
          )}
        </div>
        <a
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 truncate hover:text-indigo-600 block"
        >
          {product.product_url}
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Switch checked={product.is_active} onCheckedChange={onToggle} />
        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}
