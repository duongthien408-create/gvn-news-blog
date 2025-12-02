import { useState } from "react";
import {
  X,
  Hash,
  ChevronDown,
  ChevronRight,
  Tag,
  Building2,
  Cpu,
} from "lucide-react";

// Format tag name (all lowercase)
const formatTagName = (name) => {
  return name.toLowerCase();
};

// Tag group config - GearVN Red Color Palette
const tagGroupConfig = {
  product_category: {
    label: "Sản phẩm",
    icon: Tag,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  brand: {
    label: "Thương hiệu",
    icon: Building2,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
  },
  technology: {
    label: "Công nghệ",
    icon: Cpu,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
};

// Sidebar with Tags grouped by tag_group
const Sidebar = ({ tags, selectedTag, onSelectTag, isOpen, onClose }) => {
  const [expandedGroups, setExpandedGroups] = useState({
    product_category: true,
    brand: true,
    technology: true,
  });

  // Group tags by tag_group
  const groupedTags = tags.reduce((acc, tag) => {
    const group = tag.tag_group || "product_category";
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-800 bg-zinc-900 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
                <span className="text-xs font-bold text-white">G</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">GearVN</p>
                <p className="text-[10px] text-zinc-500">News & Review</p>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {/* All Posts button */}
            <button
              onClick={() => {
                onSelectTag(null);
                onClose();
              }}
              className={`mb-3 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                !selectedTag
                  ? "bg-red-500/10 font-medium text-red-500"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Hash className="h-4 w-4" />
              Tất cả bài viết
            </button>

            {/* Grouped Tags */}
            <nav className="space-y-2">
              {Object.entries(tagGroupConfig).map(([groupKey, config]) => {
                const groupTags = groupedTags[groupKey] || [];
                if (groupTags.length === 0) return null;

                const IconComponent = config.icon;
                const isExpanded = expandedGroups[groupKey];
                const hasSelectedTag = groupTags.some(
                  (t) => t.slug === selectedTag
                );

                return (
                  <div key={groupKey} className={`rounded-lg border ${config.borderColor} ${config.bgColor}`}>
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition hover:bg-white/5 ${config.color}`}
                    >
                      <span className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {config.label}
                        <span className={`rounded-full ${config.bgColor} border ${config.borderColor} px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                          {groupTags.length}
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Group Tags */}
                    {isExpanded && (
                      <div className="space-y-0.5 px-1.5 pb-2">
                        {groupTags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => {
                              onSelectTag(tag.slug);
                              onClose();
                            }}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition ${
                              selectedTag === tag.slug
                                ? `${config.bgColor} font-medium ${config.color} border ${config.borderColor}`
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className={selectedTag === tag.slug ? config.color : "text-zinc-600"}>#</span>
                            {formatTagName(tag.name)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-zinc-800 p-3">
            <p className="text-[10px] text-zinc-600">Powered by GearVN</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
