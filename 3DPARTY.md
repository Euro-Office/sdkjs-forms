## Third-party

This repository has no bundled third-party libraries or npm dependencies.

It is an addon plugin for the ONLYOFFICE Document Server platform and depends
on the following runtime platform namespaces provided by the host sdkjs engine:

* **Asc** / **AscCommon** — Core Ascensio platform utilities
* **AscFormat** — Format and serialization utilities
* **AscDFH** — Document Format History (undo/redo framework)
* **AscBuilder** — Document Builder API
* **AscFonts** — Font management
* **AscWord** — Word document engine classes
* **AscCommonExcel** — Excel binary reader utilities
* **AscCommon.openXml** — OpenXML package handling

These are provided by the sibling `sdkjs` repository at runtime and are not
bundled with this addon.
