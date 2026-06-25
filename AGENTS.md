# sdkjs-forms — Euro-Office Forms Extension

@../AGENTS.md

Guidance for Claude Code (and other AI agents) working in **sdkjs-forms** — the OForm (fillable forms) extension layer for `sdkjs`.

## What this repo is

An addon that extends `sdkjs` with fillable-form support: text fields, checkboxes, radio buttons, dropdowns, combo boxes, picture fields, date pickers, and complex forms. It ships as a set of JS files concatenated into the `sdkjs` word bundle at compile time. **It has no standalone build and no tests of its own.**

## How it integrates with sdkjs

Integration is driven by `configs/word.json`, which `sdkjs`'s Grunt build reads when invoked with `grunt --addon=sdkjs-forms`.

```json
{
  "sdk": {
    "min":    ["api.js", "apiPlugins.js"],
    "common": ["apiBuilder.js", "oform/OForm.js", "oform/Role.js", ...]
  }
}
```

Both `sdk.min` and `sdk.common` files are processed by the same Closure Compiler invocation (Gruntfile:277–292) — the split produces two output chunks (`sdk-all-min.js` / `sdk-all.js`), not two minification tiers. **The bracket-notation rule applies to all addon files**, not just the `min` list.

The addon registers itself by setting `window['Asc']['Addons']['forms'] = true` (verified: `api.js:38`). Removing or renaming this key breaks every sdkjs call site that gates on it.

## Source file map

| File | Purpose |
| --- | --- |
| `api.js` | Registers addon; patches `asc_docs_api.prototype` with `asc_Add*` insert methods and `asc_SetFormValue` / `asc_GetFormValue`. Contains `private_SetFormValue` (the write path for all form types). |
| `apiPlugins.js` | Plugin-layer methods (`pluginMethod_*`) on `window["asc_docs_api"]`. Exposes `GetAllForms`, `GetFormsByTag`, `SetFormValue`, `GetFormValue`, `IsFormSigned`. |
| `apiBuilder.js` | Macro/Builder API: `Api.Create*Form` static methods and `ApiDocument.prototype.InsertTextForm`. Also defines `ApiFormRoles` class for role CRUD. |
| `plugin-events.js` | Contains only JSDoc comment blocks and a `"use strict"` directive. **Not listed in `configs/word.json`** — adding executable code here has no runtime effect. |
| `oform/OForm.js` | Core `OForm` class: manages the role list, lifecycle hooks (`onEndLoad`, `onEndAction`, `onUndoRedo`), and fill-order enforcement. |
| `oform/Role.js` | `CRole` (runtime role pairing FieldGroup ↔ UserMaster) and `CRoleSettings` (data bag for name + color). |
| `oform/format/` | Serialisation layer: `CDocument`, `CFieldGroup`, `CFieldMaster`, `CUser`, `CUserMaster` and their change objects. |
| `oform/xml/` | Zip package reader/writer for the `.oform` XML format. |
| `configs/word.json` | The only build artefact this repo owns. Tells `sdkjs` Grunt which files to include and where. |

## The three API surfaces

### 1. Editor API (`api.js`) — `asc_*` methods on `asc_docs_api.prototype`

Added via double assignment (dot + bracket) to survive minification:

```js
window['Asc']['asc_docs_api'].prototype['asc_AddContentControlCheckBox']
  = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlCheckBox
  = function(...) { ... };
```

Key methods:
- `asc_AddContentControlCheckBox(oPr, oFormPr, oCommonPr)` — inserts checkbox or radio button (radio when `oPr.GroupKey` is set)
- `asc_AddContentControlPicture(oFormPr, oCommonPr, isSignature)` — inserts picture field
- `asc_AddContentControlSignature(oFormPr, oCommonPr)` — thin wrapper calling `asc_AddContentControlPicture(..., true)`
- `asc_AddContentControlList(isComboBox, oPr, oFormPr, oCommonPr)` — inserts dropdown (`isComboBox=false`) or combo box
- `asc_AddContentControlDatePicker(oPr, oCommonPr)` — inserts date picker
- `asc_AddContentControlTextForm(contentControlPr)` — inserts text field
- `asc_AddComplexForm(json, formPr)` — inserts complex form
- `asc_SetFormValue(value, formId)` — public write path; string values are **deferred** (see `private_SetFormValue` table below)
- `asc_GetFormValue(formId)` — public read path

### 2. Plugin API (`apiPlugins.js`) — `pluginMethod_*` on `asc_docs_api`

- `pluginMethod_GetAllForms()` → `ContentControl[]`
- `pluginMethod_GetFormsByTag(tag)` → `ContentControl[]`
- `pluginMethod_SetFormValue(internalId, value)` → delegates to `private_SetFormValue`
- `pluginMethod_GetFormValue(internalId)` → `string | boolean | null`; returns `null` when form is showing its placeholder
- `pluginMethod_IsFormSigned()` → `boolean`

### 3. Builder / Macro API (`apiBuilder.js`) — static `Api.Create*Form` and `ApiDocument` methods

Static methods on `Api`:
- `Api.CreateTextForm(formPr)`, `Api.CreateCheckBoxForm(formPr)`, `Api.CreateComboBoxForm(formPr)`
- `Api.CreatePictureForm(formPr)`, `Api.CreateDateForm(formPr)`, `Api.CreateComplexForm(formPr)`

`ApiFormRoles` class (via `ApiDocument.GetFormRoles()`):
- `Add(name, props)`, `Remove(name, delegateRole)`, `GetCount()`, `GetAllRoles()`, `HaveRole(name)`, `GetRoleColor(name)`, `SetRoleColor(name, color)`, `MoveUp(name)`, `MoveDown(name)`

## Critical rules

### Minification — bracket notation is mandatory for all public symbols

Production minification renames dotted property access. Both `sdk.min` and `sdk.common` files go through the same Closure Compiler invocation — the bracket-notation requirement applies to **all** addon files: `api.js`, `apiPlugins.js`, `apiBuilder.js`, and all files under `oform/`.

Correct pattern (both dot and bracket):
```js
window['Asc']['asc_docs_api'].prototype['asc_Foo'] = window['Asc']['asc_docs_api'].prototype.asc_Foo = function() {};
```

Also applies to `OForm.prototype` exports in `oform/OForm.js` and `CRoleSettings.prototype` exports in `oform/Role.js`.

### Change tracking — every mutation needs a history action

All form-field state mutations must be wrapped in `StartAction` / `FinalizeAction`. Bypassing this breaks undo, redo, and co-editing change propagation:

```js
oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlCheckBox, ...);
// ... mutations ...
oLogicDocument.FinalizeAction();
```

`private_SetFormValue` manages its own action block — do **not** wrap call sites in an additional block or the undo stack will be double-nested and corrupted.

### No npm dependencies

This repo is concatenated as plain JS into the sdkjs bundle. No `package.json`, no module system, no build step. Do not introduce `import`, `require`, or any npm packages.

### Do not rename the addon key

`window['Asc']['Addons']['forms']` is read at multiple call sites in `sdkjs` — `web-apps` depends on it indirectly via `sdkjs/common/apiBase.js`. Changing it without updating every sdkjs call site silently disables the addon.

## `private_SetFormValue` — write semantics per form type

Defined in `api.js`. Manages its own `StartAction`/`FinalizeAction` block — do **not** wrap call sites in an additional action block.

| Form type | `value` type | Behaviour |
| --- | --- | --- |
| Text / ComboBox | `string` | `SetInnerText(value)`; empty string → clear |
| DropDownList | `string` | Finds item by display text; if not found → clear |
| CheckBox | `boolean` or `"true"`/`"false"` string | `SetCheckBoxChecked(isChecked)` |
| Picture | `string` (raster image ID) | Sets blip fill. **Do not pass `""`** — `StartAction` fires but `FinalizeAction` is never reached, corrupting the undo stack. Pass `null` to clear. |
| DatePicker | `string` | `SetInnerText(value)`; `FullDate` is always reset to `null` (known limitation) |
| Any | `null` | `ClearContentControlExt()` |

## Role system mechanics

Roles live in `oform/OForm.js`. `OForm.canFillRole(roleName)` returns `false` in three distinct cases (not distinguishable from the return value alone):
1. Role name not found
2. Role already filled
3. A lower-weight role is not yet filled

**Events emitted** (via `logicDocument.sendEvent` → `api.sendEvent`):
- `asc_onOFormRoleFilled` — fired when a FieldGroup's fill state changes; args: `(roleName, isFilled)`
- `asc_onUpdateOFormRoles` — fired after any role list change; arg: `this.Roles` array

## What this repo does NOT contain

- Tests (none exist in this repo)
- A build script (build is in `sdkjs`)
- Any definition of `AscCommon`, `AscWord`, `AscBuilder`, `AscFonts`, `AscDFH`, `AscFormat`, `Asc` — all are globals injected by `sdkjs` at runtime
- `private_GetFormsManager` — expected to be provided by `sdkjs` at runtime; only called here in `apiPlugins.js`

## Findings & Long-tail
No centralized findings store exists in this repository yet. Document edge cases in code comments or GitHub issues until one is established.
