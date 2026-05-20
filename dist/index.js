import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import { createContext, useReducer, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/index.ts

// src/Types/index.ts
var MAX_HISTORY_SIZE = 50;

// src/Utils/SectionHelpers.ts
function moveUp(sections, sectionId) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === sectionId);
  if (index <= 0) {
    return sections;
  }
  return sorted.map((section, i) => {
    if (i === index - 1) {
      return { ...section, order: index };
    }
    if (i === index) {
      return { ...section, order: index - 1 };
    }
    return { ...section, order: i };
  });
}
function moveDown(sections, sectionId) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === sectionId);
  if (index < 0 || index >= sorted.length - 1) {
    return sections;
  }
  return sorted.map((section, i) => {
    if (i === index) {
      return { ...section, order: index + 1 };
    }
    if (i === index + 1) {
      return { ...section, order: index };
    }
    return { ...section, order: i };
  });
}
function removeSection(sections, sectionId) {
  return sections.filter((s) => s.id !== sectionId).sort((a, b) => a.order - b.order).map((section, i) => ({ ...section, order: i }));
}
function updateSectionData(sections, sectionId, data) {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }
    return { ...section, data: { ...section.data, ...data } };
  });
}
var INITIAL_STATE = {
  sections: [],
  past: [],
  future: [],
  selectedSectionId: null,
  isPanelOpen: false,
  isDirty: false,
  isLoading: false,
  error: null
};
function pushHistory(state) {
  const past = [...state.past, state.sections].slice(-MAX_HISTORY_SIZE);
  return { past, future: [] };
}
function visualEditorReducer(state, action) {
  switch (action.type) {
    case "SET_SECTIONS":
      return { ...state, sections: action.payload, past: [], future: [], isLoading: false, error: null };
    case "MOVE_UP":
      return { ...state, ...pushHistory(state), sections: moveUp(state.sections, action.payload), isDirty: true };
    case "MOVE_DOWN":
      return { ...state, ...pushHistory(state), sections: moveDown(state.sections, action.payload), isDirty: true };
    case "REMOVE_SECTION":
      return {
        ...state,
        ...pushHistory(state),
        sections: removeSection(state.sections, action.payload),
        isDirty: true,
        selectedSectionId: state.selectedSectionId === action.payload ? null : state.selectedSectionId,
        isPanelOpen: state.selectedSectionId === action.payload ? false : state.isPanelOpen
      };
    case "UPDATE_SECTION_DATA":
      return {
        ...state,
        ...pushHistory(state),
        sections: updateSectionData(state.sections, action.payload.id, action.payload.data),
        isDirty: true
      };
    case "UNDO": {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        sections: previous,
        past: newPast,
        future: [state.sections, ...state.future],
        isDirty: newPast.length > 0
      };
    }
    case "REDO": {
      if (state.future.length === 0) {
        return state;
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        sections: next,
        past: [...state.past, state.sections],
        future: newFuture,
        isDirty: true
      };
    }
    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.payload };
    case "TOGGLE_PANEL":
      return { ...state, isPanelOpen: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "MARK_CLEAN":
      return { ...state, isDirty: false, past: [], future: [] };
    default:
      return state;
  }
}
var VisualEditorContext = createContext(null);
function VisualEditorProvider({ config, children }) {
  const [state, dispatch] = useReducer(visualEditorReducer, INITIAL_STATE);
  useEffect(() => {
    let cancelled = false;
    async function loadSections() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const sections = await config.adapter.fetchSections(config.slug);
        if (!cancelled) {
          dispatch({ type: "SET_SECTIONS", payload: sections });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load sections";
          dispatch({ type: "SET_ERROR", payload: message });
        }
      }
    }
    loadSections();
    return () => {
      cancelled = true;
    };
  }, [config.slug, config.adapter]);
  const save = useCallback(async () => {
    try {
      await config.adapter.saveSections(config.slug, state.sections);
      dispatch({ type: "MARK_CLEAN" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save sections";
      dispatch({ type: "SET_ERROR", payload: message });
    }
  }, [config.adapter, config.slug, state.sections]);
  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  const value = useMemo(
    () => ({ state, dispatch, config, save, undo, redo, canUndo, canRedo }),
    [state, config, save, undo, redo, canUndo, canRedo]
  );
  return /* @__PURE__ */ jsx(VisualEditorContext.Provider, { value, children });
}
function useVisualEditor() {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error("useVisualEditor must be used within a VisualEditorProvider");
  }
  return context;
}
function useSectionActions() {
  const { dispatch } = useVisualEditor();
  const moveUp2 = useCallback(
    (sectionId) => dispatch({ type: "MOVE_UP", payload: sectionId }),
    [dispatch]
  );
  const moveDown2 = useCallback(
    (sectionId) => dispatch({ type: "MOVE_DOWN", payload: sectionId }),
    [dispatch]
  );
  const remove = useCallback(
    (sectionId) => dispatch({ type: "REMOVE_SECTION", payload: sectionId }),
    [dispatch]
  );
  const updateData = useCallback(
    (id, data) => dispatch({ type: "UPDATE_SECTION_DATA", payload: { id, data } }),
    [dispatch]
  );
  const select = useCallback(
    (sectionId) => dispatch({ type: "SELECT_SECTION", payload: sectionId }),
    [dispatch]
  );
  const openPanel = useCallback(
    (sectionId) => {
      dispatch({ type: "SELECT_SECTION", payload: sectionId });
      dispatch({ type: "TOGGLE_PANEL", payload: true });
    },
    [dispatch]
  );
  const closePanel = useCallback(() => {
    dispatch({ type: "TOGGLE_PANEL", payload: false });
    dispatch({ type: "SELECT_SECTION", payload: null });
  }, [dispatch]);
  return { moveUp: moveUp2, moveDown: moveDown2, remove, updateData, select, openPanel, closePanel };
}

// src/Components/NodeHeader/NodeHeader.module.css
var NodeHeader_default = {};
function NodeHeader({ sectionId, sectionType, isFirst, isLast }) {
  const { moveUp: moveUp2, moveDown: moveDown2, remove, openPanel } = useSectionActions();
  return /* @__PURE__ */ jsxs("div", { className: NodeHeader_default.header, children: [
    /* @__PURE__ */ jsx("span", { className: NodeHeader_default.sectionLabel, children: sectionType }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: NodeHeader_default.actionButton,
        onClick: () => moveUp2(sectionId),
        disabled: isFirst,
        title: "Move up",
        "aria-label": "Move section up",
        type: "button",
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "18 15 12 9 6 15" }) })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: NodeHeader_default.actionButton,
        onClick: () => moveDown2(sectionId),
        disabled: isLast,
        title: "Move down",
        "aria-label": "Move section down",
        type: "button",
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `${NodeHeader_default.actionButton} ${NodeHeader_default.deleteButton}`,
        onClick: () => remove(sectionId),
        title: "Delete section",
        "aria-label": "Delete section",
        type: "button",
        children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
          /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: NodeHeader_default.actionButton,
        onClick: () => openPanel(sectionId),
        title: "Edit section",
        "aria-label": "Edit section",
        type: "button",
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) })
      }
    )
  ] });
}

// src/Components/Node/Node.module.css
var Node_default = {};
function Node({ section, index, totalSections }) {
  const { state, config } = useVisualEditor();
  const isSelected = state.selectedSectionId === section.id;
  const sectionDef = config.sectionTypes[section.type];
  if (!sectionDef) {
    return null;
  }
  const SectionComponent = sectionDef.component;
  const label = sectionDef.label ?? section.type;
  const className = [Node_default.node, isSelected ? Node_default.nodeSelected : ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className, "data-section-id": section.id, children: [
    /* @__PURE__ */ jsx(
      NodeHeader,
      {
        sectionId: section.id,
        sectionType: label,
        isFirst: index === 0,
        isLast: index === totalSections - 1
      }
    ),
    /* @__PURE__ */ jsx("div", { className: Node_default.content, children: config.renderSection ? config.renderSection(section, index) : /* @__PURE__ */ jsx(SectionComponent, { data: section.data }) })
  ] });
}

// src/Components/Fields/Fields.module.css
var Fields_default = {};
function TextField({ config, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: Fields_default.input,
        type: "text",
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        placeholder: config.placeholder,
        required: config.required
      }
    )
  ] });
}
function TextareaField({ config, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        className: Fields_default.textarea,
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        placeholder: config.placeholder,
        required: config.required,
        rows: 4
      }
    )
  ] });
}
function NumberField({ config, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: Fields_default.input,
        type: "number",
        value: value ?? "",
        onChange: (e) => onChange(e.target.value === "" ? null : Number(e.target.value)),
        placeholder: config.placeholder,
        required: config.required
      }
    )
  ] });
}
function SelectField({ config, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        className: Fields_default.select,
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        required: config.required,
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select..." }),
          (config.options ?? []).map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
        ]
      }
    )
  ] });
}
function CheckboxField({ config, value, onChange }) {
  return /* @__PURE__ */ jsx("div", { className: Fields_default.fieldGroup, children: /* @__PURE__ */ jsxs("label", { className: Fields_default.checkboxWrapper, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        className: Fields_default.checkbox,
        type: "checkbox",
        checked: Boolean(value),
        onChange: (e) => onChange(e.target.checked)
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: Fields_default.label, style: { marginBottom: 0 }, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] })
  ] }) });
}
function ImageField({ config, value, onChange }) {
  const url = value ?? "";
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: Fields_default.input,
        type: "url",
        value: url,
        onChange: (e) => onChange(e.target.value),
        placeholder: config.placeholder ?? "https://...",
        required: config.required
      }
    ),
    url && /* @__PURE__ */ jsx(
      "img",
      {
        className: Fields_default.imagePreview,
        src: url,
        alt: config.label,
        onError: (e) => {
          e.target.style.display = "none";
        }
      }
    )
  ] });
}
function execCommand(command, value) {
  document.execCommand(command, false, value);
}
function RichTextField({ config, value, onChange }) {
  const editorRef = useRef(null);
  const handleInput = useCallback(() => {
    if (!editorRef.current) {
      return;
    }
    onChange(editorRef.current.innerHTML);
  }, [onChange]);
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: Fields_default.richTextWrapper, children: [
      /* @__PURE__ */ jsxs("div", { className: Fields_default.richTextToolbar, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: Fields_default.richTextButton,
            onClick: () => execCommand("bold"),
            type: "button",
            title: "Bold",
            children: "B"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: Fields_default.richTextButton,
            onClick: () => execCommand("italic"),
            type: "button",
            title: "Italic",
            style: { fontStyle: "italic" },
            children: "I"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: Fields_default.richTextButton,
            onClick: () => execCommand("underline"),
            type: "button",
            title: "Underline",
            style: { textDecoration: "underline" },
            children: "U"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: editorRef,
          className: Fields_default.richTextContent,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onInput: handleInput,
          dangerouslySetInnerHTML: { __html: value ?? "" }
        }
      )
    ] })
  ] });
}
function ColorField({ config, value, onChange }) {
  const colorValue = value ?? "#000000";
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: Fields_default.colorWrapper, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: Fields_default.colorInput,
          type: "color",
          value: colorValue,
          onChange: (e) => onChange(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx("span", { className: Fields_default.colorValue, children: colorValue })
    ] })
  ] });
}
function DateField({ config, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: Fields_default.input,
        type: "date",
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        required: config.required
      }
    )
  ] });
}
function buildDefaults(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});
}
function RepeaterField({ config, value, onChange }) {
  const items = value ?? [];
  const subFields = config.fields ?? [];
  const handleAdd = useCallback(() => {
    onChange([...items, buildDefaults(subFields)]);
  }, [items, subFields, onChange]);
  const handleRemove = useCallback(
    (index) => {
      onChange(items.filter((_, i) => i !== index));
    },
    [items, onChange]
  );
  const handleItemChange = useCallback(
    (index, fieldName, fieldValue) => {
      const updated = items.map((item, i) => {
        if (i !== index) {
          return item;
        }
        return { ...item, [fieldName]: fieldValue };
      });
      onChange(updated);
    },
    [items, onChange]
  );
  return /* @__PURE__ */ jsxs("div", { className: Fields_default.fieldGroup, children: [
    /* @__PURE__ */ jsxs("label", { className: Fields_default.label, children: [
      config.label,
      config.required && /* @__PURE__ */ jsx("span", { className: Fields_default.required, children: "*" })
    ] }),
    items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: Fields_default.repeaterItem, children: [
      /* @__PURE__ */ jsxs("div", { className: Fields_default.repeaterHeader, children: [
        /* @__PURE__ */ jsxs("span", { className: Fields_default.repeaterIndex, children: [
          "Item ",
          index + 1
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: Fields_default.repeaterRemove,
            onClick: () => handleRemove(index),
            type: "button",
            "aria-label": `Remove item ${index + 1}`,
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FieldRenderer,
        {
          fields: subFields,
          values: item,
          onChange: (fieldName, fieldValue) => handleItemChange(index, fieldName, fieldValue)
        }
      )
    ] }, index)),
    /* @__PURE__ */ jsx("button", { className: Fields_default.addButton, onClick: handleAdd, type: "button", children: "+ Add item" })
  ] });
}
var FIELD_COMPONENTS = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  checkbox: CheckboxField,
  image: ImageField,
  richtext: RichTextField,
  color: ColorField,
  date: DateField,
  repeater: RepeaterField
};
function FieldRenderer({ fields, values, onChange }) {
  return /* @__PURE__ */ jsx(Fragment, { children: fields.map((fieldConfig) => {
    const FieldComponent = FIELD_COMPONENTS[fieldConfig.type];
    if (!FieldComponent) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      FieldComponent,
      {
        config: fieldConfig,
        value: values[fieldConfig.name],
        onChange: (val) => onChange(fieldConfig.name, val)
      },
      fieldConfig.name
    );
  }) });
}

// src/Components/SidePanel/SidePanel.module.css
var SidePanel_default = {};
function SidePanel() {
  const { state, config } = useVisualEditor();
  const { updateData, closePanel } = useSectionActions();
  const selectedSection = useMemo(
    () => state.sections.find((s) => s.id === state.selectedSectionId) ?? null,
    [state.sections, state.selectedSectionId]
  );
  const sectionDef = selectedSection ? config.sectionTypes[selectedSection.type] : null;
  const handleFieldChange = useCallback(
    (fieldName, value) => {
      if (!selectedSection) {
        return;
      }
      updateData(selectedSection.id, { [fieldName]: value });
    },
    [selectedSection, updateData]
  );
  const overlayClass = [SidePanel_default.overlay, state.isPanelOpen ? SidePanel_default.overlayOpen : ""].filter(Boolean).join(" ");
  const label = sectionDef?.label ?? selectedSection?.type ?? "";
  return /* @__PURE__ */ jsxs("div", { className: overlayClass, role: "dialog", "aria-label": "Edit section", children: [
    /* @__PURE__ */ jsxs("div", { className: SidePanel_default.panelHeader, children: [
      /* @__PURE__ */ jsx("h2", { className: SidePanel_default.panelTitle, children: label }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: SidePanel_default.closeButton,
          onClick: closePanel,
          type: "button",
          "aria-label": "Close panel",
          children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: SidePanel_default.panelBody, children: sectionDef && selectedSection && /* @__PURE__ */ jsx(
      FieldRenderer,
      {
        fields: sectionDef.fields,
        values: selectedSection.data,
        onChange: handleFieldChange
      }
    ) })
  ] });
}

// src/Components/EditorHeader/EditorHeader.module.css
var EditorHeader_default = {};
function EditorHeader() {
  const { state, save, undo, redo, canUndo, canRedo } = useVisualEditor();
  return /* @__PURE__ */ jsxs("header", { className: EditorHeader_default.header, children: [
    /* @__PURE__ */ jsxs("div", { className: EditorHeader_default.actions, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: EditorHeader_default.iconButton,
          onClick: undo,
          disabled: !canUndo,
          type: "button",
          "aria-label": "Undo",
          children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: EditorHeader_default.iconButton,
          onClick: redo,
          disabled: !canRedo,
          type: "button",
          "aria-label": "Redo",
          children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "9 6 15 12 9 18" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: EditorHeader_default.saveButton,
        onClick: save,
        disabled: !state.isDirty,
        type: "button",
        children: [
          state.isDirty && /* @__PURE__ */ jsx("span", { className: EditorHeader_default.dirtyIndicator }),
          "Save"
        ]
      }
    )
  ] });
}

// src/Components/VisualEditor/VisualEditor.module.css
var VisualEditor_default = {};
function VisualEditorCanvas() {
  const { state } = useVisualEditor();
  const sortedSections = useMemo(
    () => [...state.sections].sort((a, b) => a.order - b.order),
    [state.sections]
  );
  if (state.isLoading) {
    return /* @__PURE__ */ jsx("div", { className: VisualEditor_default.loading, children: "Loading sections..." });
  }
  if (state.error) {
    return /* @__PURE__ */ jsx("div", { className: VisualEditor_default.error, children: state.error });
  }
  const canvasClass = [VisualEditor_default.canvas, state.isPanelOpen ? VisualEditor_default.canvasWithPanel : ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: VisualEditor_default.wrapper, children: [
    /* @__PURE__ */ jsx(EditorHeader, {}),
    /* @__PURE__ */ jsx("div", { className: canvasClass, children: sortedSections.length === 0 ? /* @__PURE__ */ jsx("div", { className: VisualEditor_default.empty, children: "No sections found" }) : sortedSections.map((section, index) => /* @__PURE__ */ jsx(
      Node,
      {
        section,
        index,
        totalSections: sortedSections.length
      },
      section.id
    )) }),
    /* @__PURE__ */ jsx(SidePanel, {})
  ] });
}
function VisualEditor({ config }) {
  const stableConfig = useMemo(() => config, [config]);
  return /* @__PURE__ */ jsx(VisualEditorProvider, { config: stableConfig, children: /* @__PURE__ */ jsx(VisualEditorCanvas, {}) });
}

export { CheckboxField, ColorField, DateField, EditorHeader, FieldRenderer, ImageField, MAX_HISTORY_SIZE, Node, NodeHeader, NumberField, RepeaterField, RichTextField, SelectField, SidePanel, TextField, TextareaField, VisualEditor, VisualEditorContext, VisualEditorProvider, moveDown, moveUp, removeSection, updateSectionData, useSectionActions, useVisualEditor };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map