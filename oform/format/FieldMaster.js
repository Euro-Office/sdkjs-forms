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
	 * @param {boolean} [generateId=false]
	 * @constructor
	 * @extends AscOForm.CBaseFormatObject
	 */
	function CFieldMaster(generateId)
	{
		AscOForm.CBaseFormatObject.call(this);

		this.FieldId = null;
		this.Field   = null;
		this.Users   = [];
		this.Signers = [];
		
		if (true === generateId)
			this.setFieldId(AscCommon.CreateGUID());
	}
	AscFormat.InitClass(CFieldMaster, AscOForm.CBaseFormatObject, AscDFH.historyitem_type_OForm_FieldMaster);
	CFieldMaster.prototype.setLogicField = function(logicField)
	{
		this.Field = logicField;
	};
	CFieldMaster.prototype.getLogicField = function()
	{
		return this.Field;
	};
	CFieldMaster.prototype.clone = function()
	{
		let fm = new CFieldMaster(true);
		this.copyTo(fm);
		return fm;
	};
	CFieldMaster.prototype.copyTo = function(fm)
	{
		fm.clearUsers();
		for (let index = 0, count = this.Users.length; index < count; ++index)
		{
			fm.addUser(this.Users[index]);
		}
		
		fm.clearSigners();
		for (let index = 0, count = this.Signers.length; index < count; ++index)
		{
			fm.addSigner(this.Signers[index]);
		}
	};
	CFieldMaster.prototype.setFieldId = function(fieldId)
	{
		if (fieldId === this.FieldId)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldMasterFieldId(this, this.FieldId, fieldId));
		this.FieldId = fieldId;
	};
	CFieldMaster.prototype.getFieldId = function()
	{
		return this.FieldId;
	};
	CFieldMaster.prototype.addUser = function(user)
	{
		if (-1 !== this.Users.indexOf(user))
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldMasterAddRemoveUser(this, user.GetId(), true));
		this.Users.push(user);
	};
	CFieldMaster.prototype.removeUser = function(user)
	{
		let index = this.Users.indexOf(user);
		if (-1 === index)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldMasterAddRemoveUser(this, user.GetId(), false));
		this.Users.splice(index, 1);
	};
	CFieldMaster.prototype.clearUsers = function()
	{
		while (this.Users.length)
		{
			this.removeUser(this.Users[this.Users.length - 1]);
		}
	};
	CFieldMaster.prototype.getUserCount = function()
	{
		return this.Users.length;
	};
	CFieldMaster.prototype.getUser = function(index)
	{
		if (index < 0 || index >= this.Users.length)
			return null;
		
		return this.Users[index];
	};
	CFieldMaster.prototype.getFirstUser = function()
	{
		let user = null;
		for (let userIndex = 0, userCount = this.getUserCount(); userIndex < userCount; ++userIndex)
		{
			let curUser = this.getUser(userIndex);
			if (!user || user.compare(curUser) < 0)
				user = curUser;
		}
		
		return user;
	};
	CFieldMaster.prototype.addSigner = function(user)
	{
		if (-1 !== this.Signers.indexOf(user))
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldMasterAddRemoveSigner(this, user.GetId(), true));
		this.Signers.push(user);
	};
	CFieldMaster.prototype.removeSigner = function(user)
	{
		let index = this.Signers.indexOf(user);
		if (-1 === index)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldMasterAddRemoveSigner(this, user.GetId(), false));
		this.Signers.splice(index, 1);
	};
	CFieldMaster.prototype.clearSigners = function()
	{
		while (this.Signers.length)
		{
			this.removeSigner(this.Signers[this.Signers.length - 1]);
		}
	};
	CFieldMaster.prototype.checkUser = function(user)
	{
		for (let index = 0, count = this.Users.length; index < count; ++index)
		{
			if (this.Users[index] === user)
				return true;
		}
		
		return false;
	};
	CFieldMaster.prototype.isUseInDocument = function()
	{
		return (this.Field
			&& this.Field.IsUseInDocument()
			&& this === this.Field.GetFieldMaster());
	};
	CFieldMaster.prototype.isMainField = function()
	{
		return (this.Field && this.Field.IsMainForm());
	};
	CFieldMaster.prototype.toXml = function(writer)
	{
		let context = writer.context;
		
		writer.WriteXmlHeader();
		writer.WriteXmlNodeStart("fieldMaster");
		writer.WriteXmlRelationshipsNS();
		if (this.FieldId)
			writer.WriteXmlNullableAttributeString("id", this.FieldId);
		writer.WriteXmlAttributesEnd();
		
		writer.WriteXmlNodeStart("users");
		writer.WriteXmlAttributesEnd();
		
		for (let index = 0, count = this.Users.length; index < count; ++index)
		{
			let user = this.Users[index];
			let part = context.getUserMasterPart(user);
			if (!part)
				continue;
			
			writer.WriteXmlNodeStart("user");
			writer.WriteXmlNullableAttributeString("r:id", context.getRId(part));
			writer.WriteXmlAttributesEnd(true);
		}
		writer.WriteXmlNodeEnd("users");
		
		writer.WriteXmlNodeStart("signRequest");
		writer.WriteXmlAttributesEnd();
		
		for (let index = 0, count = this.Signers.length; index < count; ++index)
		{
			let user = this.Signers[index];
			let part = context.getUserMasterPart(user);
			if (!part)
				continue;
			
			writer.WriteXmlNodeStart("user");
			writer.WriteXmlNullableAttributeString("r:id", context.getRId(part));
			writer.WriteXmlAttributesEnd(true);
		}
		writer.WriteXmlNodeEnd("signRequest");
		
		writer.WriteXmlNodeEnd("fieldMaster");
	};
	CFieldMaster.fromXml = function(reader)
	{
		if (!reader.ReadNextNode())
			return null;
		
		if ("fieldMaster" !== reader.GetNameNoNS())
			return null;
		
		let fieldMaster = new CFieldMaster();
		
		while (reader.MoveToNextAttribute())
		{
			if ("id" === reader.GetNameNoNS())
				fieldMaster.setFieldId(reader.GetValueDecodeXml());
		}
		
		let depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth))
		{
			switch(reader.GetNameNoNS())
			{
				case "users":
				{
					let users = readUsersFromXml(reader);
					for (let index = 0, count = users.length; index < count; ++index)
					{
						fieldMaster.addUser(users[index]);
					}
					break;
				}
				case "signRequest":
				{
					let users = readUsersFromXml(reader);
					for (let index = 0, count = users.length; index < count; ++index)
					{
						fieldMaster.addSigner(users[index]);
					}
					break;
				}
			}
		}
		
		return fieldMaster;
	};
	
	function readUsersFromXml(reader)
	{
		let xmlReaderContext = reader.GetOformContext();
		let users = [];
		let depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth))
		{
			if ("user" === reader.GetNameNoNS())
			{
				while (reader.MoveToNextAttribute())
				{
					if ("r:id" === reader.GetName())
					{
						let rId = reader.GetValueDecodeXml();
						let rel = reader.rels.getRelationship(rId);
						let userMaster = xmlReaderContext && xmlReaderContext.getUserMaster(rel.getFullPath());
						if (userMaster)
							users.push(userMaster);
					}
				}
			}
		}
		return users;
	}
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CFieldMaster = CFieldMaster;

})(window);
