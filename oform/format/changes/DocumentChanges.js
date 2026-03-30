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
	window['AscDFH'].historyitem_OForm_Document_Author      = window['AscDFH'].historyitem_type_OForm_Document | 1;
	window['AscDFH'].historyitem_OForm_Document_Date        = window['AscDFH'].historyitem_type_OForm_Document | 2;
	window['AscDFH'].historyitem_OForm_Document_Description = window['AscDFH'].historyitem_type_OForm_Document | 3;
	window['AscDFH'].historyitem_OForm_Document_Type        = window['AscDFH'].historyitem_type_OForm_Document | 4;
	window['AscDFH'].historyitem_OForm_Document_Application = window['AscDFH'].historyitem_type_OForm_Document | 5;
	window['AscDFH'].historyitem_OForm_Document_DocumentId  = window['AscDFH'].historyitem_type_OForm_Document | 6;
	window['AscDFH'].historyitem_OForm_Document_FieldGroup  = window['AscDFH'].historyitem_type_OForm_Document | 7;
	window['AscDFH'].historyitem_OForm_Document_User        = window['AscDFH'].historyitem_type_OForm_Document | 8;
	window['AscDFH'].historyitem_OForm_Document_UserMaster  = window['AscDFH'].historyitem_type_OForm_Document | 9;
	window['AscDFH'].historyitem_OForm_Document_FieldMaster = window['AscDFH'].historyitem_type_OForm_Document | 10;
	window['AscDFH'].historyitem_OForm_Document_DefaultUser = window['AscDFH'].historyitem_type_OForm_Document | 11;
	window['AscDFH'].historyitem_OForm_Document_Final       = window['AscDFH'].historyitem_type_OForm_Document | 12;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentAuthor(Class, oldAuthor, newAuthor)
	{
		let oldId = oldAuthor ? oldAuthor.GetId() : undefined;
		let newId = newAuthor ? newAuthor.GetId() : undefined;
		
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, oldId, newId);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentAuthor,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Author,
		function(value)
		{
			if (undefined === value)
			{
				this.Class.Author = undefined;
			}
			else
			{
				let author = AscCommon.g_oTableId.GetById(value);
				if (author)
					this.Class.Author = value;
			}
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentAuthor = CChangesOFormDocumentAuthor;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentDate(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentDate,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Date,
		function(value)
		{
			this.Class.Date = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentDate = CChangesOFormDocumentDate;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentDescription(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentDescription,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Description,
		function(value)
		{
			this.Class.Description = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentDescription = CChangesOFormDocumentDescription;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentType(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentType,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Type,
		function(value)
		{
			this.Class.Type = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentType = CChangesOFormDocumentType;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentApplication(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentApplication,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_Application,
		function(value)
		{
			this.Class.Application = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentApplication = CChangesOFormDocumentApplication;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentDocumentId(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentDocumentId,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_DocumentId,
		function(value)
		{
			this.Class.DocumentId = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentDocumentId = CChangesOFormDocumentDocumentId;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormDocumentFieldGroup(Class, fieldGroupId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, fieldGroupId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormDocumentFieldGroup,
		window['AscDFH'].historyitem_OForm_Document_FieldGroup,
		function()
		{
			let fieldGroup = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.FieldGroups.indexOf(fieldGroup))
			{
				fieldGroup.setParent(this.Class);
				this.Class.FieldGroups.push(fieldGroup);
				this.Class.onChangeFieldGroups();
			}
		},
		function()
		{
			let fieldGroup = AscCommon.g_oTableId.GetById(this.Key);
			let index      = this.Class.FieldGroups.indexOf(fieldGroup);
			if (-1 !== index)
			{
				fieldGroup.setParent(null);
				this.Class.FieldGroups.splice(index, 1);
				this.Class.onChangeFieldGroups();
			}
		}
	);
	window['AscDFH'].CChangesOFormDocumentFieldGroup = CChangesOFormDocumentFieldGroup;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormDocumentUser(Class, userId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, userId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormDocumentUser,
		window['AscDFH'].historyitem_OForm_Document_User,
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
	window['AscDFH'].CChangesOFormDocumentUser = CChangesOFormDocumentUser;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormDocumentUserMaster(Class, userMasterId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, userMasterId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormDocumentUserMaster,
		window['AscDFH'].historyitem_OForm_Document_UserMaster,
		function()
		{
			let userMaster = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.UserMasters.indexOf(userMaster))
			{
				userMaster.setParent(this.Class);
				this.Class.UserMasters.push(userMaster);
			}
		},
		function()
		{
			let userMaster = AscCommon.g_oTableId.GetById(this.Key);
			let index      = this.Class.UserMasters.indexOf(userMaster);
			if (-1 !== index)
			{
				userMaster.setParent(null);
				this.Class.UserMasters.splice(index, 1);
			}
		}
	);
	window['AscDFH'].CChangesOFormDocumentUserMaster = CChangesOFormDocumentUserMaster;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesDictionaryBase}
	 */
	function CChangesOFormDocumentFieldMaster(Class, fieldMasterId, isAdd)
	{
		window['AscDFH'].CChangesDictionaryBase.call(this, Class, fieldMasterId, isAdd);
	}
	window['AscDFH'].InheritDictionaryChange(
		CChangesOFormDocumentFieldMaster,
		window['AscDFH'].historyitem_OForm_Document_FieldMaster,
		function()
		{
			let field = AscCommon.g_oTableId.GetById(this.Key);
			if (-1 === this.Class.FieldMasters.indexOf(field))
				this.Class.FieldMasters.push(field);
		},
		function()
		{
			let field = AscCommon.g_oTableId.GetById(this.Key);
			let index = this.Class.FieldMasters.indexOf(field);
			if (-1 !== index)
				this.Class.FieldMasters.splice(index, 1);
		}
	);
	window['AscDFH'].CChangesOFormDocumentFieldMaster = CChangesOFormDocumentFieldMaster;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormDocumentDefaultUser(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentDefaultUser,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_Document_DefaultUser,
		function(value)
		{
			let document = this.Class;
			let userMaster = AscCommon.g_oTableId.GetById(value);
			if (userMaster)
			{
				userMaster.setParent(document);
				document.DefaultUser = userMaster;
			}
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentDefaultUser = CChangesOFormDocumentDefaultUser;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseBoolProperty}
	 */
	function CChangesOFormDocumentFinal(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseBoolProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormDocumentFinal,
		window['AscDFH'].CChangesBaseBoolProperty,
		window['AscDFH'].historyitem_OForm_Document_Final,
		function(value)
		{
			this.Class.Final = value;
			this.Class.onChangeFinal();
		},
		false
	);
	window['AscDFH'].CChangesOFormDocumentFinal = CChangesOFormDocumentFinal;

})(window);
