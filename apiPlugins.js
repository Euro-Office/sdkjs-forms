/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use strict";

(function(window)
{
	let Api = window["asc_docs_api"];
	
	/**
	 * @typedef {Object} ContentControl
	 * The content control object.
	 * @property {string} Tag - A tag assigned to the content control. The same tag can be assigned to several content controls so that you can make reference to them in your code.
	 * @property {string} Id - A unique content control identifier. It can be used to search for a certain content control and make reference to it in your code.
	 * @property {ContentControlLock} Lock - A value that defines if it is possible to delete and/or edit the content control or not.
	 * @property {string} InternalId - A unique internal identifier of the content control. It is used for all operations with content controls.
	 * @property {string} Alias - An alias of the content control.
	 * @property {1 | 2} Appearance - The visualization type of the content control: <b>1</b> - frame (bounding box), <b>2</b> - hidden.
	 * @property {string} [FormKey] - A unique form key. Present only if the content control is a form field.
	 * @property {string} [RadioGroup] - A group key of the radio button. Present only if the content control is a radio button form field .
	 * @property {string | boolean | Date} [FormValue] - The current value of the form field. Present only if the content control is a form field.
	 * @property {{R: number, G: number, B: number}} [Color] - The tag color of the content control. Present only if the tag color is set.
	 * @property {{Color: {R: number, G: number, B: number, A: number}}} [Border] - The border color of the content control. Present only if the border color is set.
	 * @property {{Color: {R: number, G: number, B: number, A: number}}} [Shd] - The shading color of the content control. Present only if the shading color is set.
	 * @see office-js-api/Examples/Plugins/Forms/Enumeration/ContentControl.js
	 */
	
	/**
	 * @typedef {(0 | 1 | 2 | 3)} ContentControlLock
	 * A value that defines if it is possible to delete and/or edit the content control or not:
	 * **0** - only deleting
	 * **1** - disable deleting or editing
	 * **2** - only editing
	 * **3** - full access
	 * @see office-js-api/Examples/Plugins/Forms/Enumeration/ContentControlLock.js
	 */

	/**
	 * Returns information about all the forms that have been added to the document.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @alias GetAllForms
	 * @returns {ContentControl[]} - An array with all the forms from the document.
	 * @see office-js-api/Examples/Plugins/Forms/Api/Methods/GetAllForms.js
	 */
	Api.prototype["pluginMethod_GetAllForms"] = function()
	{
		let oFormsManager = this.private_GetFormsManager();
		if (!oFormsManager)
			return [];

		let arrForms  = oFormsManager.GetAllForms();
		let arrResult = [];
		for (let nIndex = 0, nCount = arrForms.length; nIndex < nCount; ++nIndex)
		{
			arrResult.push(arrForms[nIndex].GetContentControlPr().GetEventObject());
		}
		return arrResult;
	};
	/**
	 * Returns information about all the forms that have been added to the document with specified tag.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @alias GetFormsByTag
	 * @param {string} tag - The form tag.
	 * @returns {ContentControl[]} - An array with all the forms from the document with the specified tag.
	 * @see office-js-api/Examples/Plugins/Forms/Api/Methods/GetFormsByTag.js
	 */
	Api.prototype["pluginMethod_GetFormsByTag"] = function(tag)
	{
		let oFormsManager = this.private_GetFormsManager();
		if (!oFormsManager)
			return [];

		let arrForms  = oFormsManager.GetAllForms();
		let arrResult = [];
		let oForm     = null;
		for (let nIndex = 0, nCount = arrForms.length; nIndex < nCount; ++nIndex)
		{
			oForm = arrForms[nIndex];
			if (oForm.GetTag() === tag)
				arrResult.push(oForm.GetContentControlPr().GetEventObject());
		}
		return arrResult;
	};
	/**
	 * Sets a value to the specified form.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @alias SetFormValue
	 * @param {string} internalId - A unique internal identifier of the form.
	 * @param {string | boolean} value - Form value to be set. Its type depends on the form type.
	 * @see office-js-api/Examples/Plugins/Forms/Api/Methods/SetFormValue.js
	 */
	Api.prototype["pluginMethod_SetFormValue"] = function(internalId, value)
	{
		this.private_SetFormValue(internalId, value);
	};
	/**
	 * Returns a value of the specified form.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @alias GetFormValue
	 * @param {string} internalId - A unique internal identifier of the form.
	 * @returns {null | string | boolean} The form value in the string or boolean format depending on the form type. The null value means that the form is filled with a placeholder.
	 * @see office-js-api/Examples/Plugins/Forms/Api/Methods/GetFormValue.js
	 */
	Api.prototype["pluginMethod_GetFormValue"] = function(internalId)
	{
		if (!AscCommon.g_oTableId)
			return "";

		let oForm = AscCommon.g_oTableId.GetClass(internalId);

		if (!oForm
			|| !(oForm instanceof AscWord.CInlineLevelSdt)
			|| !oForm.IsForm())
			return "";

		if (oForm.IsPlaceHolder())
			return null;

		if (oForm.IsTextForm() || oForm.IsComboBox() || oForm.IsDropDownList())
		{
			return oForm.GetInnerText();
		}
		else if (oForm.IsCheckBox())
		{
			return oForm.IsCheckBoxChecked();
		}
		else if (oForm.IsPictureForm())
		{
			let oImg;
			let allDrawings = oForm.GetAllDrawingObjects();
			for (let nDrawing = 0; nDrawing < allDrawings.length; ++nDrawing)
			{
				if (allDrawings[nDrawing].IsPicture())
				{
					oImg = allDrawings[nDrawing].GraphicObj;
					break;
				}
			}

			if (oImg)
				return oImg.getBase64Img();
		}

		return "";
	};
	/**
	 * Checks whether the specified form has been digitally signed.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @alias IsFormSigned
	 * @returns {boolean} Returns true if the form is signed, false otherwise.
	 * @since 9.3.0
	 * @see office-js-api/Examples/Plugins/Forms/Api/Methods/IsFormSigned.js
	 */
	Api.prototype["pluginMethod_IsFormSigned"] = function()
	{
		let signatures = this.signatures;
		if (!signatures || !Array.isArray(signatures))
			return false;
		
		for (let i = 0; i < signatures.length; ++i)
		{
			if (signatures[i].isForm)
				return true;
		}
		
		return false;
	};

})(window);

