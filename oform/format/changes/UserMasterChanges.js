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
	window['AscDFH'].historyitem_OForm_UserMaster_UserId    = window['AscDFH'].historyitem_type_OForm_UserMaster | 1;
	window['AscDFH'].historyitem_OForm_UserMaster_Role      = window['AscDFH'].historyitem_type_OForm_UserMaster | 2;
	window['AscDFH'].historyitem_OForm_UserMaster_Color     = window['AscDFH'].historyitem_type_OForm_UserMaster | 3;
	window['AscDFH'].historyitem_OForm_UserMaster_UserName  = window['AscDFH'].historyitem_type_OForm_UserMaster | 4;
	window['AscDFH'].historyitem_OForm_UserMaster_UserEmail = window['AscDFH'].historyitem_type_OForm_UserMaster | 5;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserMasterUserId(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserMasterUserId,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_UserMaster_UserId,
		function(Value)
		{
			this.Class.UserId = Value;
			this.Class.onChange();
		},
		false
	);
	window['AscDFH'].CChangesOFormUserMasterUserId = CChangesOFormUserMasterUserId;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserMasterRole(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserMasterRole,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_UserMaster_Role,
		function(Value)
		{
			this.Class.Role = Value;
			this.Class.onChange();
		},
		false
	);
	window['AscDFH'].CChangesOFormUserMasterRole = CChangesOFormUserMasterRole;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseObjectProperty}
	 */
	function CChangesOFormUserMasterColor(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseObjectProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserMasterColor,
		window['AscDFH'].CChangesBaseObjectProperty,
		window['AscDFH'].historyitem_OForm_UserMaster_Color,
		function(value)
		{
			this.Class.Color = value;
			this.Class.onChange();
		},
		false
	);
	CChangesOFormUserMasterColor.prototype.private_CreateObject = function()
	{
		return new AscWord.CDocumentColor(0, 0, 0);
	};
	window['AscDFH'].CChangesOFormUserMasterColor = CChangesOFormUserMasterColor;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserMasterUserName(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserMasterUserName,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_UserMaster_UserName,
		function(Value)
		{
			this.Class.UserName = Value;
			this.Class.onChange();
		},
		false
	);
	window['AscDFH'].CChangesOFormUserMasterUserName = CChangesOFormUserMasterUserName;
	
	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserMasterUserEmail(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserMasterUserEmail,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_UserMaster_UserEmail,
		function(Value)
		{
			this.Class.UserEmail = Value;
			this.Class.onChange();
		},
		false
	);
	window['AscDFH'].CChangesOFormUserMasterUserEmail = CChangesOFormUserMasterUserEmail;

})(window);
