/*
 * (c) Copyright Ascensio System SIA 2010-2024
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */


"use strict";
(function(window, builder)
{
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Import
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const AscBuilder         = window["AscBuilder"];

	const ApiDocument            = AscBuilder.ApiDocument;
	const GetStringParameter     = AscBuilder.GetStringParameter;
	const GetBoolParameter       = AscBuilder.GetBoolParameter;
	const GetNumberParameter     = AscBuilder.GetNumberParameter;
	const GetArrayParameter      = AscBuilder.GetArrayParameter;
	const executeNoFormLockCheck = AscBuilder.executeNoFormLockCheck;
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Base class
	 * @global
	 * @class
	 * @name Api
	 */
	var Api = AscBuilder.Word.Api;
 
	/**
	 * Common form properties.
	 * @typedef {Object} FormPrBase
	 * @property {string} key - The form key.
	 * @property {string} tip - The form tip text.
	 * @property {string} tag - The form tag.
	 * @property {string} role - The role to fill out form.
	 * @property {boolean} required - Specifies if the form is required or not.
	 * @property {string} placeholder - The form placeholder text.
	 * @see office-js-api/Examples/Enumerations/FormPrBase.js
	 */

	/**
	 * Specific text field properties.
	 * @typedef {Object} TextFormPrBase
	 * @property {boolean} comb - Specifies if the text field should be a comb of characters with the same cell width. The maximum number of characters must be set to a positive value.
	 * @property {number} maxCharacters - The maximum number of characters in the text field.
	 * @property {number} cellWidth - The cell width for each character measured in millimeters. If this parameter is not specified or equal to 0 or less, then the width will be set automatically.
	 * @property {boolean} multiLine - Specifies if the current fixed size text field is multiline or not.
	 * @property {boolean} autoFit - Specifies if the text field content should be autofit, i.e. whether the font size adjusts to the size of the fixed size form.
	 * @see office-js-api/Examples/Enumerations/TextFormPrBase.js
	 */

	/**
	 * Text field properties.
	 * @typedef {FormPrBase | TextFormPrBase} TextFormPr
	 * @see office-js-api/Examples/Enumerations/TextFormPr.js
	 */
	
	/**
	 * Form insertion specific properties.
	 * @typedef {Object} FormInsertPr
	 * @property {boolean} [placeholderFromSelection=false] - Specifies if the currently selected text should be saved as a placeholder of the inserted form.
	 * @property {boolean} [keepSelectedTextInForm=true] - Specifies if the currently selected text should be saved as the content of the inserted form.
	 * @see office-js-api/Examples/Enumerations/FormInsertPr.js
	 */
	
	/**
	 * Properties for inserting a text field.
	 * @typedef {FormPrBase | TextFormPrBase | FormInsertPr} TextFormInsertPr
	 * @see office-js-api/Examples/Enumerations/TextFormInsertPr.js
	 */
	
	 
	/**
	 * Specific checkbox / radio button properties.
	 * @typedef {Object} CheckBoxFormPrBase
	 * @property {boolean} radio - Specifies if the current checkbox is a radio button. In this case, the key parameter is considered as an identifier for the group of radio buttons.
	 * @see office-js-api/Examples/Enumerations/CheckBoxFormPrBase.js
	 */

	/**
	 * Checkbox / radio button properties.
	 * @typedef {FormPrBase | CheckBoxFormPrBase} CheckBoxFormPr
	 * @see office-js-api/Examples/Enumerations/CheckBoxFormPr.js
	 */

	/**
	 * Specific combo box / dropdown list properties.
	 * @typedef {Object} ComboBoxFormPrBase
	 * @property {boolean} editable - Specifies if the combo box text can be edited.
	 * @property {boolean} autoFit - Specifies if the combo box form content should be autofit, i.e. whether the font size adjusts to the size of the fixed size form.
	 * @property {Array.<string | Array.<string>>} items - The combo box items.
     * This array consists of strings or arrays of two strings where the first string is the displayed value and the second one is its meaning.
     * If the array consists of single strings, then the displayed value and its meaning are the same.
     * Example: ["First", ["Second", "2"], ["Third", "3"], "Fourth"].

	 * @see office-js-api/Examples/Enumerations/ComboBoxFormPrBase.js
	 */

	/**
	 * Combo box / dropdown list properties.
	 * @typedef {FormPrBase | ComboBoxFormPrBase} ComboBoxFormPr
	 * @see office-js-api/Examples/Enumerations/ComboBoxFormPr.js
	 */

	/**
	 * The condition to scale an image in the picture form.
	 * @typedef {"always" | "never" | "tooBig" | "tooSmall"} ScaleFlag
	 * @see office-js-api/Examples/Enumerations/ScaleFlag.js
	 */

	/**
	 * Value from 0 to 100.
	 * @typedef {number} percentage
	 * @see office-js-api/Examples/Enumerations/percentage.js
	 */

	/**
	 * Specific picture form properties.
	 * @typedef {Object} PictureFormPrBase
	 * @property {ScaleFlag} scaleFlag - The condition to scale an image in the picture form: "always", "never", "tooBig" or "tooSmall".
	 * @property {boolean} lockAspectRatio - Specifies if the aspect ratio of the picture form is locked or not.
	 * @property {boolean} respectBorders - Specifies if the form border width is respected or not when scaling the image.
	 * @property {percentage} shiftX - Horizontal picture position inside the picture form measured in percent:
	 * <b>0</b> - the picture is placed on the left;
	 * <b>50</b> - the picture is placed in the center;
	 * <b>100</b> - the picture is placed on the right.
	 * @property {percentage} shiftY - Vertical picture position inside the picture form measured in percent:
	 * <b>0</b> - the picture is placed on top;
	 * <b>50</b> - the picture is placed in the center;
	 * <b>100</b> - the picture is placed on the bottom.
	 * @see office-js-api/Examples/Enumerations/PictureFormPrBase.js
	 */

	/**
	 * Picture form properties.
	 * @typedef {FormPrBase | PictureFormPrBase} PictureFormPr
	 * @see office-js-api/Examples/Enumerations/PictureFormPr.js
	 */

	/**
	 * Specific date form properties.
	 * @typedef {Object} DateFormPrBase
	 * @property {string} format	- The date format, ex: mm.dd.yyyy
	 * @property {string} lang		- The date language. Possible value for this parameter is a language identifier as defined by
	 * RFC 4646/BCP 47. Example: "en-CA".
	 * @see office-js-api/Examples/Enumerations/DateFormPrBase.js
	 */

	/**
	 * Date form properties.
	 * @typedef {FormPrBase | DateFormPrBase} DateFormPr
	 * @see office-js-api/Examples/Enumerations/DateFormPr.js
	 */

	/**
	 * Creates a text field with the specified text field properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {TextFormPr} formPr - Text field properties.
	 * @returns {ApiTextForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreateTextForm.js
	 */
	Api.CreateTextForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			let form = CreateCommonForm(formPr);
			ApplyTextFormPr(form, formPr);
			CheckForm(form);
			return new AscBuilder.ApiTextForm(form);
		}, this);
	};
	/**
	 * Creates a checkbox / radio button with the specified checkbox / radio button properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {CheckBoxFormPr} formPr - Checkbox / radio button properties.
	 * @returns {ApiCheckBoxForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreateCheckBoxForm.js
	 */
	Api.CreateCheckBoxForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			formPr["placeholder"] = undefined;
			
			var oCC;
			var oCheckboxPr = new AscCommon.CSdtCheckBoxPr();
			if (GetBoolParameter(formPr["radio"], false))
			{
				oCheckboxPr.CheckedSymbol   = 0x25C9;
				oCheckboxPr.UncheckedSymbol = 0x25CB;
				oCheckboxPr.GroupKey        = GetStringParameter(formPr["key"], "Group1");
			}
			else
			{
				oCheckboxPr.CheckedSymbol   = 0x2611;
				oCheckboxPr.UncheckedSymbol = 0x2610;
			}
			
			oCheckboxPr.CheckedFont   = "Segoe UI Symbol";
			oCheckboxPr.UncheckedFont = "Segoe UI Symbol";
			
			var nCheckedSymbol   = oCheckboxPr && oCheckboxPr.CheckedSymbol ? oCheckboxPr.CheckedSymbol : Asc.c_oAscSdtCheckBoxDefaults.CheckedSymbol;
			var nUncheckedSymbol = oCheckboxPr && oCheckboxPr.UncheckedSymbol ? oCheckboxPr.UncheckedSymbol : Asc.c_oAscSdtCheckBoxDefaults.UncheckedSymbol;
			var sCheckedFont     = oCheckboxPr && oCheckboxPr.CheckedFont ? oCheckboxPr.CheckedFont : Asc.c_oAscSdtCheckBoxDefaults.CheckedFont;
			var sUncheckedFont   = oCheckboxPr && oCheckboxPr.UncheckedFont ? oCheckboxPr && oCheckboxPr.UncheckedFont : Asc.c_oAscSdtCheckBoxDefaults.UncheckedFont;
			
			var isLoadFonts = false;
			if (!AscCommon.IsAscFontSupport(sCheckedFont, nCheckedSymbol))
			{
				isLoadFonts = true;
				AscFonts.FontPickerByCharacter.getFontBySymbol(nCheckedSymbol);
			}
			
			if (!AscCommon.IsAscFontSupport(sUncheckedFont, nUncheckedSymbol))
			{
				isLoadFonts = true;
				AscFonts.FontPickerByCharacter.getFontBySymbol(nUncheckedSymbol);
			}
			
			function private_PerformAddCheckBox()
			{
				oCC = CreateCommonForm(formPr);
				oCC.ApplyCheckBoxPr(oCheckboxPr);
			}
			
			if (isLoadFonts)
			{
				var oFonts             = {};
				oFonts[sCheckedFont]   = true;
				oFonts[sUncheckedFont] = true;
				
				AscCommon.Check_LoadingDataBeforePrepaste(this, oFonts, {}, private_PerformAddCheckBox);
			}
			else
			{
				private_PerformAddCheckBox();
			}
			
			CheckForm(oCC);
			return new AscBuilder.ApiCheckBoxForm(oCC);
		}, this);
	};
	/**
	 * Creates a combo box / dropdown list with the specified combo box / dropdown list properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {ComboBoxFormPr} formPr - Combo box / dropdown list properties.
	 * @returns {ApiComboBoxForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreateComboBoxForm.js
	 */
	Api.CreateComboBoxForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			var oPr = new AscCommon.CSdtComboBoxPr();
			oPr.AddItem(AscCommon.translateManager.getValue("Choose an item"), "");
			
			var oCC = CreateCommonForm(formPr);
			
			let sPlaceholder = GetStringParameter(formPr["placeholder"], undefined);
			
			let arrList = GetArrayParameter(formPr["items"], []);
			for (let nIndex = 0, nCount = arrList.length; nIndex < nCount; ++nIndex)
			{
				let oItem = arrList[nIndex];
				
				if (GetStringParameter(oItem, null))
				{
					oPr.AddItem(oItem, oItem);
				}
				else if (GetArrayParameter(oItem, null))
				{
					let sDisplay = GetStringParameter(oItem[0], null);
					let sValue   = GetStringParameter(oItem[1], null);
					if (null !== sDisplay && null !== sValue)
						oPr.AddItem(sDisplay, sValue);
				}
			}
			oPr.SetAutoFit(GetBoolParameter(formPr["autoFit"], false));
			
			if (!GetBoolParameter(formPr["editable"], false))
			{
				if (sPlaceholder)
				{
					oCC.ApplyDropDownListPr(oPr);
				}
				else
				{
					oCC.SetDropDownListPr(oPr);
					oCC.SelectListItem();
				}
			}
			else
			{
				if (sPlaceholder)
				{
					oCC.ApplyComboBoxPr(oPr);
				}
				else
				{
					oCC.SetComboBoxPr(oPr);
					oCC.SelectListItem();
				}
			}
			
			CheckForm(oCC);
			return new AscBuilder.ApiComboBoxForm(oCC);
		}, this);
	};
	/**
	 * Creates a picture form with the specified picture form properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {PictureFormPr} formPr - Picture form properties.
	 * @returns {ApiPictureForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreatePictureForm.js
	 */
	Api.CreatePictureForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			if (GetStringParameter("placeholder", null))
				formPr["placeholder"] = AscCommon.translateManager.getValue("Click to load image");
			
			var oCC = CreateCommonForm(formPr);
			oCC.ApplyPicturePr(true);
			oCC.ConvertFormToFixed();
			
			let oPr = new AscCommon.CSdtPictureFormPr();
			
			let sScale = GetStringParameter(formPr["scaleFlag"], undefined);
			switch (sScale)
			{
				case "always":
					oPr.SetScaleFlag(Asc.c_oAscPictureFormScaleFlag.Always);
					break;
				case "never":
					oPr.SetScaleFlag(Asc.c_oAscPictureFormScaleFlag.Never);
					break;
				case "tooBig":
					oPr.SetScaleFlag(Asc.c_oAscPictureFormScaleFlag.Bigger);
					break;
				case "tooSmall":
					oPr.SetScaleFlag(Asc.c_oAscPictureFormScaleFlag.Smaller);
					break;
			}
			
			oPr.SetConstantProportions(GetBoolParameter(formPr["lockAspectRatio"], true));
			oPr.SetRespectBorders(GetBoolParameter(formPr["respectBorders"], false));
			oPr.SetShiftX(Math.max(0, Math.min(100, GetNumberParameter(formPr["shiftX"], 50))) / 100);
			oPr.SetShiftY(Math.max(0, Math.min(100, GetNumberParameter(formPr["shiftY"], 50))) / 100);
			
			oCC.SetPictureFormPr(oPr);
			
			CheckForm(oCC);
			return new AscBuilder.ApiPictureForm(oCC);
		}, this);
	};
	/**
	 * Creates a date form with the specified date form properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {DateFormPr} formPr - Date form properties.
	 * @returns {ApiDateForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreateDateForm.js
	 */
	Api.CreateDateForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			let form = CreateCommonForm(formPr);
			ApplyDateFormPr(form, formPr);
			CheckForm(form);
			return new AscBuilder.ApiDateForm(form);
		}, this);
	};
	/**
	 * Creates a complex form with the specified complex form properties.
	 * @memberof Api
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {FormPrBase} formPr - Complex form properties.
	 * @returns {ApiComplexForm}
	 * @see office-js-api/Examples/Forms/Api/Methods/CreateComplexForm.js
	 */
	Api.CreateComplexForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};

			let form = CreateCommonForm(formPr);
			ApplyComplexFormPr(form);
			CheckForm(form);
			return new AscBuilder.ApiComplexForm(form);
		}, this);
	};
	/**
	 * Inserts a text box with the specified text box properties over the selected text.
	 * @memberof ApiDocument
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {TextFormInsertPr} formPr - Properties for inserting a text field.
	 * @returns {ApiTextForm}
	 * @see office-js-api/Examples/Forms/ApiDocument/Methods/InsertTextForm.js
	 */
	ApiDocument.prototype.InsertTextForm = function(formPr)
	{
		return executeNoFormLockCheck(function()
		{
			if (!formPr)
				formPr = {};
			
			let logicDocument = this.Document;
			let placeholder   = GetStringParameter(formPr["placeholder"], undefined);
			if (GetBoolParameter(formPr["placeholderFromSelection"], false))
				placeholder = logicDocument.GetSelectedText();
			
			if (!GetBoolParameter(formPr["keepSelectedTextInForm"], true))
				logicDocument.RemoveBeforePaste();
			
			let contentControl = logicDocument.AddContentControl(c_oAscSdtLevelType.Inline);
			if (!contentControl)
				return null;
			
			ApplyCommonFormPr(contentControl, formPr);
			SetFormPlaceholder(contentControl, placeholder);
			ApplyTextFormPr(contentControl, formPr, true);
			CheckForm(contentControl);
			return new AscBuilder.ApiTextForm(contentControl);
		}, this);
	};
	
	/**
	 * Class representing a collection of form roles.
	 * @constructor
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 */
	function ApiFormRoles(oform)
	{
		this.oform = oform;
	}
	
	/**
	 * The date form properties.
	 * @typedef {FormPrBase | DateFormPrBase} DateFormPr
	 * @see office-js-api/Examples/Enumerations/DateFormPr.js
	 */
	
	/**
	 * The role properties.
	 * @typedef {Object} RoleProperties
	 * @property {string} color - The role color.
	 * @see office-js-api/Examples/Enumerations/RoleProperties.js
	 */
	
	/**
	 * Returns a collection of form roles.
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @returns {ApiFormRoles}
	 * @see office-js-api/Examples/Forms/ApiDocument/Methods/GetFormRoles.js
	 */
	ApiDocument.prototype.GetFormRoles = function()
	{
		return new ApiFormRoles(this.Document.GetOFormDocument());
	};
	
	/**
	 * Adds a new form role.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The name of role being added.
	 * @param {RoleProperties} props - The role properties.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/Add.js
	 */
	ApiFormRoles.prototype.Add = function(name, props)
	{
		if (!this.oform || !name || this.oform.getRole(name))
			return false;
		
		let rgba = ParseRoleColor(props && props["color"] ? props["color"] : null);
		
		let rolePr = new AscOForm.CRoleSettings();
		rolePr.Name  = name;
		rolePr.Color = AscCommon.CreateAscColorCustom(rgba.R, rgba.G, rgba.B);
		this.oform.addRole(rolePr);
		return true;
	};
	/**
	 * Removes a role with the specified name.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The name of role to be removed.
	 * @param {string} [delegateRole] - The name of the role to which all forms bound to this role will be delegated.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/Remove.js
	 */
	ApiFormRoles.prototype.Remove = function(name, delegateRole)
	{
		if (!this.oform)
			return false;
		
		return this.oform.removeRole(name, delegateRole);
	};
	/**
	 * Returns a number of form roles.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @returns {number}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/GetCount.js
	 */
	ApiFormRoles.prototype.GetCount = function()
	{
		if (!this.oform)
			return 0;
		
		return this.oform.getAllRoles().length;
	};
	/**
	 * Lists all available roles.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @returns {string[]}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/GetAllRoles.js
	 */
	ApiFormRoles.prototype.GetAllRoles = function()
	{
		if (!this.oform)
			return [];
		
		let roles = this.oform.getAllRoles();
		let result = [];
		for (let i = 0; i < roles.length; ++i)
		{
			result.push(roles[i].getRole());
		}
		return result;
	};
	/**
	 * Checks if a role with the specified name exists.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The role name.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/HaveRole.js
	 */
	ApiFormRoles.prototype.HaveRole = function(name)
	{
		return this.oform && this.oform.haveRole(name);
	};
	/**
	 * Returns the RGB color of the specified role.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The role name.
	 * @returns {null | {r:byte, g:byte, b:byte}}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/GetRoleColor.js
	 */
	ApiFormRoles.prototype.GetRoleColor = function(name)
	{
		if (!this.oform || !this.oform.haveRole(name))
			return null;
		
		let color = this.oform.getRoleSettings(name).getColor();
		if (!color)
			return null;
		
		return {
			"r" : color.r,
			"g" : color.g,
			"b" : color.b
		};
	};
	/**
	 * Sets the color for the specified role.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The role name.
	 * @param {string} color - The role color.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/SetRoleColor.js
	 */
	ApiFormRoles.prototype.SetRoleColor = function(name, color)
	{
		if (!this.oform || !this.oform.haveRole(name))
			return false;
		
		let rgba = ParseRoleColor(color);
		
		let rolePr = new AscOForm.CRoleSettings();
		rolePr.Name  = name;
		rolePr.Color = AscCommon.CreateAscColorCustom(rgba.R, rgba.G, rgba.B);
		this.oform.editRole(name, rolePr);
		return true;
	};
	/**
	 * Moves a role up in filling order.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The role name.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/MoveUp.js
	 */
	ApiFormRoles.prototype.MoveUp = function(name)
	{
		if (!this.oform)
			return false;
		
		return this.oform.moveUpRole(name);
	};
	/**
	 * Moves a role down in filling order.
	 * @memberof ApiFormRoles
	 * @since 9.0.0
	 * @typeofeditors ["CDE", "CFE"]
	 * @param {string} name - The role name.
	 * @returns {boolean}
	 * @see office-js-api/Examples/Forms/ApiFormRoles/Methods/MoveDown.js
	 */
	ApiFormRoles.prototype.MoveDown = function(name)
	{
		if (!this.oform)
			return false;
		
		return this.oform.moveDownRole(name);
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function CreateCommonForm(formPr)
	{
		let contentControl = new AscCommonWord.CInlineLevelSdt();
		
		ApplyCommonFormPr(contentControl, formPr);
		
		let placeholder = formPr ? GetStringParameter(formPr["placeholder"], undefined) : undefined;
		SetFormPlaceholder(contentControl, placeholder);
		
		let tag = formPr ? GetStringParameter(formPr["tag"], undefined) : undefined;
		if (tag)
			contentControl.SetTag(tag);
		
		contentControl.ReplaceContentWithPlaceHolder(false);
		contentControl.UpdatePlaceHolderTextPrForForm();
		return contentControl;
	}
	function SetFormPlaceholder(form, text)
	{
		if (text)
			form.SetPlaceholderText(text);
		else
			form.SetPlaceholder(c_oAscDefaultPlaceholderName.Text);
	}
	function ApplyCommonFormPr(form, formPr)
	{
		if (!formPr)
			formPr = {};
		
		let sdtFormPr = new AscCommon.CSdtFormPr();
		sdtFormPr.SetHelpText(GetStringParameter(formPr["tip"], undefined));
		sdtFormPr.SetRequired(GetBoolParameter(formPr["required"], false));
		sdtFormPr.SetKey(GetStringParameter(formPr["key"], undefined));
		sdtFormPr.SetRole(GetStringParameter(formPr["role"], undefined));
		form.SetFormPr(sdtFormPr);
	}
	function ApplyTextFormPr(form, formPr, keepContent)
	{
		let textFormPr = new AscCommon.CSdtTextFormPr();
		textFormPr.SetComb(GetBoolParameter(formPr["comb"], false));
		textFormPr.SetMaxCharacters(GetNumberParameter(formPr["maxCharacters"], -1));
		textFormPr.SetMultiLine(GetBoolParameter(formPr["multiLine"], false));
		textFormPr.SetAutoFit(GetBoolParameter(formPr["autoFit"], false));
		textFormPr.SetWidth((GetNumberParameter(formPr["cellWidth"], 0) * 72 * 20 / 25.4) | 0);
		form.ApplyTextFormPr(textFormPr, keepContent);
	}
	function ApplyDateFormPr(form, formPr)
	{
		let datePickerPr = new AscCommon.CSdtDatePickerPr();

		var nLcid = Asc.g_oLcidNameToIdMap[formPr["lang"]];
		if (undefined == nLcid)
			nLcid = 1033;

		datePickerPr.SetDateFormat(GetStringParameter(formPr["format"], "mm/dd/yyyy"));
		datePickerPr.SetLangId(nLcid);

		form.ApplyDatePickerPr(datePickerPr);
	}
	function ApplyComplexFormPr(form)
	{
		let complexFormPr = new AscWord.CSdtComplexFormPr();
		form.SetComplexFormPr(complexFormPr);
	}
	function CheckForm(form)
	{
		CheckFormKey(form);
		CheckFormRole(form);
	}
	function CheckFormKey(form)
	{
		let logicDocument = editor && editor.WordControl && editor.WordControl.m_oLogicDocument;
		if (!form || !form.IsForm() || !logicDocument)
			return;

		let key = form.GetFormKey();
		if (key && "" !== key.trim())
			return;

		let formManager  = logicDocument.GetFormsManager();
		let keyGenerator = formManager.GetKeyGenerator();

		let formPr = form.GetFormPr().Copy();
		if (!formPr)
			return;

		key = keyGenerator.GetNewKey(form);
		formPr.SetKey(key);
		form.SetFormPr(formPr);
	}
	function CheckFormRole(form)
	{
		let logicDocument = editor && editor.WordControl && editor.WordControl.m_oLogicDocument;
		if (!form || !form.IsForm() || !logicDocument)
			return;
		
		let role = form.GetFormRole();
		if (role && "" !== role.trim())
			return;
		
		let oform = logicDocument.GetOFormDocument();
		if (!oform)
			return;
		
		let defaultRole = oform.getDefaultRole();
		if (!defaultRole)
			return;
		
		form.SetFormRole(defaultRole.getRole());
	}
	function ParseRoleColor(color)
	{
		return color ? AscCommon.RgbaTextToRGBA(color) : {R : 254, G : 248, B : 229, A : 255};
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Export
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Api["CreateTextForm"]     = Api.CreateTextForm;
	Api["CreatePictureForm"]  = Api.CreatePictureForm;
	Api["CreateDateForm"]     = Api.CreateDateForm;
	Api["CreateCheckBoxForm"] = Api.CreateCheckBoxForm;
	Api["CreateComboBoxForm"] = Api.CreateComboBoxForm;
	Api["CreateComplexForm"]  = Api.CreateComplexForm;
	
	ApiDocument.prototype["InsertTextForm"] = ApiDocument.prototype.InsertTextForm;
	ApiDocument.prototype["GetFormRoles"]   = ApiDocument.prototype.GetFormRoles;
	
	ApiFormRoles.prototype["Add"]          = ApiFormRoles.prototype.Add;
	ApiFormRoles.prototype["Remove"]       = ApiFormRoles.prototype.Remove;
	ApiFormRoles.prototype["GetCount"]     = ApiFormRoles.prototype.GetCount;
	ApiFormRoles.prototype["GetAllRoles"]  = ApiFormRoles.prototype.GetAllRoles;
	ApiFormRoles.prototype["HaveRole"]     = ApiFormRoles.prototype.HaveRole;
	ApiFormRoles.prototype["GetRoleColor"] = ApiFormRoles.prototype.GetRoleColor;
	ApiFormRoles.prototype["SetRoleColor"] = ApiFormRoles.prototype.SetRoleColor;
	ApiFormRoles.prototype["MoveUp"]       = ApiFormRoles.prototype.MoveUp;
	ApiFormRoles.prototype["MoveDown"]     = ApiFormRoles.prototype.MoveDown;

}(window, null));

