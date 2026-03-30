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
	 * @constructor
	 * @extends AscOForm.CBaseFormatObject
	 */
	function CFieldGroup()
	{
		AscOForm.CBaseFormatObject.call(this);

		this.Filled = false;
		this.Date   = undefined;
		this.Weight = null;
		this.Fields = [];
		this.Users  = [];
		
		this.Parent = null;
	}
	AscFormat.InitClass(CFieldGroup, AscOForm.CBaseFormatObject, AscDFH.historyitem_type_OForm_FieldGroup);
	CFieldGroup.prototype.setParent = function(parent)
	{
		if (this.Parent === parent)
			return;
		
		this.Parent = parent;
		this.onChange();
	};
	CFieldGroup.prototype.isFilled = function()
	{
		return !!this.Filled;
	};
	CFieldGroup.prototype.setFilled = function(isFilled)
	{
		if (this.Filled === isFilled)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupFilled(this, this.Filled, isFilled));
		this.Filled = isFilled;
		this.onChangeFilled();
	};
	CFieldGroup.prototype.setWeight = function(value)
	{
		if (this.Weight === value)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupWeight(this, this.Weight, value));
		this.Weight = value;
		this.onChange();
	};
	CFieldGroup.prototype.getWeight = function()
	{
		return this.Weight;
	};
	CFieldGroup.prototype.setDate = function(date)
	{
		if (date === this.Date)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupDate(this, this.Date, date));
		this.Date = date;
	};
	CFieldGroup.prototype.getDate = function()
	{
		return this.Date;
	};
	CFieldGroup.prototype.addField = function(field)
	{
		if (!field || -1 !== this.Fields.indexOf(field))
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupAddRemoveField(this, field.GetId(), true));
		this.Fields.push(field);
		this.onChange();
	};
	CFieldGroup.prototype.removeField = function(field)
	{
		if (!field)
			return;

		let index = this.Fields.indexOf(field);
		if (-1 === index)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupAddRemoveField(this, field.GetId(), false));
		this.Fields.splice(index, 1);
		this.onChange();
	};
	CFieldGroup.prototype.getFieldCount = function()
	{
		return this.Fields.length;
	};
	CFieldGroup.prototype.getField = function(index)
	{
		return (index >= 0 && index < this.Fields.length ? this.Fields[index] : null);
	};
	CFieldGroup.prototype.addUser = function(user)
	{
		if (!user || -1 !== this.Users.indexOf(user))
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupAddRemoveUser(this, user.GetId(), true));
		this.Users.push(user);
		this.onChange();
	};
	CFieldGroup.prototype.removeUser = function(user)
	{
		if (!user)
			return;
		
		let index = this.Users.indexOf(user);
		if (-1 === index)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormFieldGroupAddRemoveUser(this, user.GetId(), false));
		this.Users.splice(index, 1);
		this.onChange();
	};
	CFieldGroup.prototype.getUserCount = function()
	{
		return this.Users.length;
	};
	CFieldGroup.prototype.getUser = function(index)
	{
		return (index >= 0 && index < this.Users.length ? this.Users[index] : null);
	};
	CFieldGroup.prototype.clear = function()
	{
		while (this.Users.length)
		{
			this.removeUser(this.Users[this.Users.length - 1]);
		}
		
		while (this.Fields.length)
		{
			this.removeField(this.Fields[this.Fields.length - 1]);
		}
	};
	CFieldGroup.prototype.onChange = function()
	{
		if (!this.Parent)
			return;
		
		this.Parent.onChangeFieldGroup(this);
	};
	CFieldGroup.prototype.onChangeFilled = function()
	{
		if (!this.Parent)
			return;
		
		this.Parent.onChangeFieldGroupFilled(this);
	};
	CFieldGroup.prototype.getAllFields = function()
	{
		let fields = [];
		for (let fieldIndex = 0, fieldCount = this.Fields.length; fieldIndex < fieldCount; ++fieldIndex)
		{
			if (this.Fields[fieldIndex].isUseInDocument()
				&& this.Fields[fieldIndex].isMainField())
			{
				fields.push(this.Fields[fieldIndex]);
			}
		}
		
		if (this.Users.length && this.Parent)
		{
			for (let index = 0, count = this.Users.length; index < count; ++index)
			{
				let userFields = this.Parent.getAllFieldsByUserMaster(this.Users[index]);
				for (let fieldIndex = 0, fieldCount = userFields.length; fieldIndex < fieldCount; ++fieldIndex)
				{
					if (-1 === fields.indexOf(userFields[fieldIndex])
						&& userFields[fieldIndex].isUseInDocument()
						&& userFields[fieldIndex].isMainField())
					{
						fields.push(userFields[fieldIndex]);
					}
				}
			}
		}
		
		return fields;
	};
	CFieldGroup.prototype.getFirstUser = function()
	{
		let user = null;
		for (let index = 0, userCount = this.Users.length; index < userCount; ++index)
		{
			let curUser = this.Users[index];
			if (!user || user.compare(curUser) < 0)
				user = curUser;
		}
		
		if (!user)
		{
			for (let fieldIndex = 0, fieldCount = this.Fields.length; fieldIndex < fieldCount; ++fieldIndex)
			{
				let curUser = this.Fields[fieldIndex].getFirstUser();
				if (!user || user.compare(curUser) < 0)
					user = curUser;
			}
		}
		return user;
	};
	CFieldGroup.prototype.toXml = function(writer)
	{
		let context = writer.context;
		
		writer.WriteXmlNodeStart("fieldGroup");
		writer.WriteXmlNullableAttributeInt("weight", this.getWeight());
		if (this.isFilled())
			writer.WriteXmlNullableAttributeBool("filled", true);
		
		if (this.Date)
		{
			let dateUtc = new Date(this.Date).toISOString().slice(0, 19) + 'Z';
			writer.WriteXmlNullableAttributeString("date", dateUtc);
		}
		
		writer.WriteXmlAttributesEnd();
		
		for (let userIndex = 0, userCount = this.Users.length; userIndex < userCount; ++userIndex)
		{
			let part = context.getUserMasterPart(this.Users[userIndex]);
			if (!part)
				continue;

			writer.WriteXmlNodeStart("user");
			writer.WriteXmlNullableAttributeString("r:id", context.getRId(part));
			writer.WriteXmlAttributesEnd(true);
		}
		
		for (let fieldIndex = 0, fieldCount = this.Fields.length; fieldIndex < fieldCount; ++fieldIndex)
		{
			let part = context.getFieldMasterPart(this.Fields[fieldIndex]);
			if (!part)
				continue;

			writer.WriteXmlNodeStart("field");
			writer.WriteXmlNullableAttributeString("r:id", context.getRId(part));
			writer.WriteXmlAttributesEnd(true);
		}
		
		writer.WriteXmlNodeEnd("fieldGroup");
	};
	CFieldGroup.fromXml = function(reader)
	{
		let fG = new CFieldGroup();
		
		while (reader.MoveToNextAttribute())
		{
			let attrName = reader.GetNameNoNS();
			if ("weight" === attrName)
				fG.setWeight(reader.GetValueInt());
			else if ("filled" === attrName)
				fG.setFilled(reader.GetValueBool());
			else if ("date" === attrName)
			{
				let date = AscCommon.getTimeISO8601(reader.GetValueDecodeXml());
				if (!isNaN(date))
					fG.setDate(date);
			}
		}
		
		let xmlReaderContext = reader.GetOformContext();
		let depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth))
		{
			switch(reader.GetNameNoNS())
			{
				case "user":
					
					while (reader.MoveToNextAttribute())
					{
						if ("r:id" === reader.GetName())
						{
							let rId = reader.GetValueDecodeXml();
							let rel = reader.rels.getRelationship(rId);
							let userMaster = xmlReaderContext && xmlReaderContext.getUserMaster(rel.getFullPath());
							if (userMaster)
								fG.addUser(userMaster);
						}
					}
					
					break;
				case "field":
					
					while (reader.MoveToNextAttribute())
					{
						if ("r:id" === reader.GetName())
						{
							let rId = reader.GetValueDecodeXml();
							let rel = reader.rels.getRelationship(rId);
							let fieldMaster = xmlReaderContext && xmlReaderContext.getFieldMaster(rel.getFullPath());
							if (fieldMaster)
								fG.addField(fieldMaster);
						}
					}
					
					break;
			}
		}
		
		return fG;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CFieldGroup = CFieldGroup;

})(window);
