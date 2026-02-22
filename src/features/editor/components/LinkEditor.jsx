import { useState, useRef, useMemo } from "react";
import { useLinks } from "../hooks/useLinks";
import { useProfile } from "../../../hooks/useProfile";
import { PhonePreview } from "./PhonePreview";
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  BarChart2,
  ExternalLink,
  Pencil,
  X,
  Check,
  Loader2,
  Eye,
  Layout,
} from "lucide-react";
import { Switch } from "../../../components/ui/Switch";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export function LinkEditor() {
  const {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    uploadThumbnail,
    reorderLinks,
  } = useLinks();
  const { profile } = useProfile();

  const [isAdding, setIsAdding] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [activeId, setActiveId] = useState(null);
  const itemIds = useMemo(() => links.map((link) => link._id), [links]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link._id === active.id);
      const newIndex = links.findIndex((link) => link._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(links, oldIndex, newIndex);
        reorderLinks(newOrder);
      }
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Please fill in both fields");
      return;
    }
    try {
      setAddingLoading(true);
      await addLink({ title: newLinkTitle, url: newLinkUrl });
      setNewLinkTitle("");
      setNewLinkUrl("");
      setIsAdding(false);
      toast.success("Link added!");
    } catch (error) {
      toast.error("Error creating link");
    } finally {
      setAddingLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 p-4`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Delete this link?
              </h3>
              <p className="mt-1 text-sm text-slate-500 mb-4">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    executeDelete(id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 5000 },
    );
  };

  const executeDelete = async (id) => {
    await deleteLink(id);
    toast.success("Link deleted successfully");
  };

  const handleToggleActive = async (id, newStatus) => {
    try {
      await updateLink(id, { is_active: newStatus });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const activeLink = useMemo(
    () => links.find((l) => l._id === activeId),
    [activeId, links],
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.5" },
      },
    }),
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Links</h1>
          <p className="text-slate-500 mt-1">
            Add and manage the links on your page.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Link
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden mb-2"
              >
                <Card className="p-4 border border-indigo-100 bg-indigo-50/50 shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-indigo-900 uppercase tracking-wide">
                      Create New Link
                    </h3>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="text-indigo-400 hover:text-indigo-700 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleAddLink} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. My Portfolio"
                          className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-sm transition-all"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-sm transition-all"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={addingLoading}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
                      >
                        {addingLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Check size={16} />
                        )}{" "}
                        Create Link
                      </button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {links.length === 0 && !isAdding ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Layout size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">
                  No links yet
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Share your content with the world.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-indigo-600 font-bold hover:underline text-sm"
                >
                  Create your first link
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={itemIds}
                  strategy={verticalListSortingStrategy}
                >
                  {links.map((link) => (
                    <SortableLinkItem
                      key={link._id}
                      link={link}
                      updateLink={updateLink}
                      deleteLink={handleDelete}
                      handleToggleActive={handleToggleActive}
                      uploadThumbnail={uploadThumbnail}
                    />
                  ))}
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                  {activeLink ? (
                    <div className="opacity-90 scale-105 cursor-grabbing pointer-events-none">
                      <LinkItem
                        link={activeLink}
                        updateLink={updateLink}
                        deleteLink={handleDelete}
                        handleToggleActive={handleToggleActive}
                        uploadThumbnail={uploadThumbnail}
                        isOverlay
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-1 animate-fade-in">
          {/* Content Area */}
          {/* ✅ CHANGED: flex-col, justify-end, pb-6 to push phone down */}
          <div className="relative flex-1 w-full flex flex-col items-center justify-end overflow-hidden pb-2">
            <div
              onClick={(e) => e.stopPropagation()}
              className="scale-80 origin-bottom"
            >
              <PhonePreview profile={profile} />
            </div>
          </div>

          {/* Close Button */}
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

// --- SORTABLE WRAPPER ---
function SortableLinkItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: "relative",
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LinkItem {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

// --- ACTUAL LINK CARD ---
function LinkItem({
  link,
  updateLink,
  deleteLink,
  handleToggleActive,
  uploadThumbnail,
  dragHandleProps,
  isOverlay,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    await updateLink(link._id, { title: editTitle, url: editUrl });
    setIsEditing(false);
    toast.success("Link updated");
  };

  const handleImageClick = () => {
    if (!isOverlay) fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImg(true);
      await uploadThumbnail(link._id, file);
      toast.success("Thumbnail updated");
    } catch (error) {
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div className="group">
      <Card
        className={`p-0 transition-all border border-slate-200 ${
          isOverlay
            ? "border-indigo-500 shadow-2xl"
            : "hover:border-indigo-300 hover:shadow-md"
        } ${!link.is_active ? "opacity-75 bg-slate-50" : "bg-white"}`}
      >
        <div className="flex items-center p-3 gap-3">
          {/* DRAG HANDLE */}
          <div
            {...dragHandleProps}
            className="cursor-grab text-slate-300 hover:text-slate-600 active:cursor-grabbing p-1 focus:outline-none touch-none"
          >
            <GripVertical size={18} />
          </div>

          <div
            onClick={handleImageClick}
            className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors cursor-pointer overflow-hidden relative"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {uploadingImg ? (
              <Loader2 className="animate-spin text-indigo-500" size={16} />
            ) : link.thumbnail_url ? (
              <img
                src={link.thumbnail_url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={18} className="text-slate-400" />
            )}
            {!isOverlay && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Pencil size={12} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="grid gap-2">
                <input
                  className="w-full font-bold text-sm text-slate-900 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <input
                  className="w-full text-xs text-slate-500 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleSave}
                    className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-md font-bold hover:bg-slate-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-500 text-[10px] px-3 py-1 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-sm text-slate-900 truncate">
                  {link.title}
                </h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 truncate hover:text-indigo-600 hover:underline flex items-center gap-1"
                >
                  {link.url} <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100 relative z-10">
              <div className="hidden sm:flex flex-col items-center min-w-[30px]">
                <div className="flex items-center gap-1 text-slate-900 font-bold text-xs">
                  {link.clicks || 0}{" "}
                  <BarChart2 size={10} className="text-slate-400" />
                </div>
              </div>
              <div className="scale-75 origin-right">
                <Switch
                  checked={link.is_active || false}
                  onCheckedChange={(checked) =>
                    handleToggleActive(link._id, checked)
                  }
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteLink(link._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
