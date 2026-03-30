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
	window['AscDFH'].historyitem_OForm_User_UserMaster = window['AscDFH'].historyitem_type_OForm_User | 1;
	window['AscDFH'].historyitem_OForm_User_Email      = window['AscDFH'].historyitem_type_OForm_User | 2;
	window['AscDFH'].historyitem_OForm_User_Telephone  = window['AscDFH'].historyitem_type_OForm_User | 3;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserUserMaster(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserUserMaster,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_User_UserMaster,
		function(value)
		{
			if (!value)
			{
				this.Class.UserMaster = undefined;
			}
			else
			{
				let userMaster = AscCommon.g_oTableId.Get_ById(value);
				if (userMaster)
					this.Class.UserMaster = userMaster;
			}
		},
		false
	);
	window['AscDFH'].CChangesOFormUserUserMaster = CChangesOFormUserUserMaster;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserEmail(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserEmail,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_User_Email,
		function(value)
		{
			this.Class.Email = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormUserEmail = CChangesOFormUserEmail;

	/**
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBaseStringProperty}
	 */
	function CChangesOFormUserTelephone(Class, Old, New)
	{
		window['AscDFH'].CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	window['AscDFH'].InheritPropertyChange(
		CChangesOFormUserTelephone,
		window['AscDFH'].CChangesBaseStringProperty,
		window['AscDFH'].historyitem_OForm_User_Telephone,
		function(value)
		{
			this.Class.Telephone = value;
		},
		false
	);
	window['AscDFH'].CChangesOFormUserTelephone = CChangesOFormUserTelephone;

})(window);
