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

(function(window)
{
	window['AscDFH'].historyitem_OForm_FieldGroup_Weight         = window['AscDFH'].historyitem_type_OForm_FieldGroup | 1;
	window['AscDFH'].historyitem_OForm_FieldGroup_AddRemoveField = window['AscDFH'].historyitem_type_OForm_FieldGroup | 2;
	window['AscDFH'].historyitem_OForm_FieldGroup_AddRemoveUser  = window['AscDFH'].historyitem_type_OForm_FieldGroup | 3;
	window['AscDFH'].historyitem_OForm_FieldGroup_Filled         = window['AscDFH'].historyitem_type_OForm_FieldGroup | 4;
	window['AscDFH'].historyitem_OForm_FieldGroup_Date           = window['AscDFH'].historyitem_type_OForm_FieldGroup | 5;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseLongProperty}
	 */
	function CChangesOFormFieldGroupWeight(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseLongProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormFieldGroupWeight,
		window['AscDFH'].CChangesBaseLongProperty,
		window['AscDFH'].historyitem_OForm_FieldGroup_Weight,
		function(value)
		{
			this.Class.Weight = value;
			this.Class.onChange();
		},
		false
	);
	window['AscDFH'].CChangesOFormFieldGroupWeight = CChangesOFormFieldGroupWeight;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormFieldGroupAddRemoveField(Class, fieldId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, fieldId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormFieldGroupAddRemoveField,
		window['AscDFH'].historyitem_OForm_FieldGroup_AddRemoveField,
		function()
		{
			let field = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.Fields.indexOf(field))
				this.Class.Fields.push(field);
			
			this.Class.onChange();
		},
		function()
		{
			let field  = AscCommon.g_oTableId.GetById(this.Key);
			let index = this.Class.Fields.indexOf(field);
			if (-1 !== index)
				this.Class.Fields.splice(index, 1);
			
			this.Class.onChange();
		}
	);
	window['AscDFH'].CChangesOFormFieldGroupAddRemoveField = CChangesOFormFieldGroupAddRemoveField;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormFieldGroupAddRemoveUser(Class, userMasterId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, userMasterId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormFieldGroupAddRemoveUser,
		window['AscDFH'].historyitem_OForm_FieldGroup_AddRemoveUser,
		function()
		{
			let userMaster = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.Users.indexOf(userMaster))
				this.Class.Users.push(userMaster);
			
			this.Class.onChange();
		},
		function()
		{
			let userMaster = AscCommon.g_oTableId.GetById(this.Key);
			let index      = this.Class.Fields.indexOf(userMaster);
			if (-1 !== index)
				this.Class.Users.splice(index, 1);
			
			this.Class.onChange();
		}
	);
	window['AscDFH'].CChangesOFormFieldGroupAddRemoveUser = CChangesOFormFieldGroupAddRemoveUser;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseBoolProperty}
	 */
	function CChangesOFormFieldGroupFilled(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseBoolProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormFieldGroupFilled,
		window['AscDFH'].CChangesBaseBoolProperty,
		window['AscDFH'].historyitem_OForm_FieldGroup_Filled,
		function(value)
		{
			this.Class.Filled = value;
			this.Class.onChangeFilled();
		},
		false
	);
	window['AscDFH'].CChangesOFormFieldGroupFilled = CChangesOFormFieldGroupFilled;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormFieldGroupDate(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormFieldGroupDate,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_FieldGroup_Date,
		function(value)
		{
			let v = parseInt(value);
			this.Class.Date = isNaN(v) ? undefined : v;
		},
		false
	);
	window['AscDFH'].CChangesOFormFieldGroupDate = CChangesOFormFieldGroupDate;
	
})(window);
