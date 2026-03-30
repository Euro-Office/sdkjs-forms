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
	window['AscDFH'].historyitem_OFormFieldMaster_FieldId         = window['AscDFH'].historyitem_type_OForm_FieldMaster | 1;
	window['AscDFH'].historyitem_OFormFieldMaster_AddRemoveUser   = window['AscDFH'].historyitem_type_OForm_FieldMaster | 2;
	window['AscDFH'].historyitem_OFormFieldMaster_AddRemoveSigner = window['AscDFH'].historyitem_type_OForm_FieldMaster | 3;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormFieldMasterFieldId(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormFieldMasterFieldId,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OFormFieldMaster_FieldId,
		function(value)
		{
			this.Class.FieldId = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormFieldMasterFieldId = CChangesOFormFieldMasterFieldId;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormFieldMasterAddRemoveUser(Class, userId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, userId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormFieldMasterAddRemoveUser,
		window['AscDFH'].historyitem_OFormFieldMaster_AddRemoveUser,
		function()
		{
			let user = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.Users.indexOf(user))
				this.Class.Users.push(user);
		},
		function()
		{
			let user  = AscCommon.g_oTableId.GetById(this.Key);
			let index = this.Class.Users.indexOf(user);
			if (-1 !== index)
				this.Class.Users.splice(index, 1);
		}
	);
	window['AscDFH'].CChangesOFormFieldMasterAddRemoveUser = CChangesOFormFieldMasterAddRemoveUser;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormFieldMasterAddRemoveSigner(Class, userId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, userId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormFieldMasterAddRemoveSigner,
		window['AscDFH'].historyitem_OFormFieldMaster_AddSigner,
		function()
		{
			let user = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.Signers.indexOf(user))
				this.Class.Signers.push(user);
		},
		function()
		{
			let user  = AscCommon.g_oTableId.GetById(this.Key);
			let index = this.Class.Signers.indexOf(user);
			if (-1 !== index)
				this.Class.Signers.splice(index, 1);
		}
	);
	window['AscDFH'].CChangesOFormFieldMasterAddRemoveSigner = CChangesOFormFieldMasterAddRemoveSigner;

})(window);
