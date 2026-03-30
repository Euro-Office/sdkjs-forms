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
	/**
	 * @param {AscOForm.CUserMaster} userMaster
	 * @constructor
	 * @extends AscOForm.CBaseFormatObject
	 */
	function CUser(userMaster)
	{
		AscOForm.CBaseFormatObject.call(this);

		this.Email      = undefined;
		this.Telephone  = undefined;
		this.UserMaster = undefined;

		if (userMaster)
			this.setUserMaster(userMaster);
	}
	AscFormat.InitClass(CUser, AscOForm.CBaseFormatObject, AscDFH.historyitem_type_OForm_User);
	CUser.prototype.setUserMaster = function(userMaster)
	{
		if (this.UserMaster === userMaster)
			return;

		let oldValue = this.UserMaster ? this.UserMaster.GetId() : undefined;
		let newValue = userMaster ? userMaster.GetId() : undefined;

		AscCommon.History.Add(new AscDFH.CChangesOFormUserUserMaster(this, oldValue, newValue));
		this.UserMaster = userMaster;
	};
	CUser.prototype.setEmail = function(email)
	{
		if (email === this.Email)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormUserEmail(this, this.Email, email));
		this.Email = email;
	};
	CUser.prototype.setTelephone = function(telephone)
	{
		if (telephone === this.Telephone)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormUserTelephone(this, this.Telephone, telephone));
		this.Telephone = telephone;
	};
	CUser.prototype.getUserMaster = function()
	{
		return this.UserMaster;
	};
	CUser.prototype.toXml = function(writer)
	{
		writer.WriteXmlHeader();
		writer.WriteXmlNodeStart("user");
		writer.WriteXmlAttributesEnd();
		
		if (this.Email)
			writer.WriteXmlNodeWithText("email", this.Email);
		if (this.Telephone)
			writer.WriteXmlNodeWithText("telephone", this.Telephone);
		
		writer.WriteXmlNodeEnd("user");
	};
	CUser.fromXml = function(reader)
	{
		if (!reader.ReadNextNode())
			return null;
		
		let name = reader.GetNameNoNS();
		if ("user" !== reader.GetNameNoNS())
			return null;
		
		let user = new CUser();
		let depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth))
		{
			name = reader.GetNameNoNS();
			switch(reader.GetNameNoNS())
			{
				case "email":
					user.setEmail(reader.GetTextDecodeXml());
					break;
				case "telephone":
					user.setTelephone(reader.GetTextDecodeXml());
					break;
			}
		}
		
		return user;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CUser = CUser;

})(window);
