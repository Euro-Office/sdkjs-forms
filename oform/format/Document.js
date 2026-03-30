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
	 * Основной класс для работы с форматом oform
	 * @param oform {AscOForm.OForm}
	 * @constructor
	 * @extends AscOForm.CBaseFormatObject
	 */
	function CDocument(oform)
	{
		AscOForm.CBaseFormatObject.call(this);
		
		this.OForm = oform;
		
		this.DefaultUser = new AscOForm.CUserMaster();
		this.DefaultUser.initDefaultUser();
		this.DefaultUser.setParent(this);

		// Форматная часть
		this.Author      = null;
		this.Date        = null;
		this.Description = null;
		this.Type        = null;
		this.Application = null;
		this.DocumentId  = null;
		this.Final       = false;
		this.FieldGroups = [];

		// Массивы всех имеющихся пользователей и полей
		this.Users        = [];
		this.UserMasters  = [];
		this.FieldMasters = [];
	}
	AscFormat.InitClass(CDocument, AscOForm.CBaseFormatObject, AscDFH.historyitem_type_OForm_Document);
	CDocument.prototype.clear = function()
	{
		// TODO: fields?
		this.clearUsers();
		this.clearUserMasters();
		this.clearFieldGroups();
		this.clearFieldMasters();
	};
	CDocument.prototype.setDefaultUser = function(userMaster)
	{
		if (!userMaster || userMaster === this.DefaultUser)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentDefaultUser(this, this.DefaultUser.GetId(), userMaster.GetId()));
		this.DefaultUser = userMaster;
	};
	CDocument.prototype.setAuthor = function(author)
	{
		if (this.Author === author)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentAuthor(this, this.Author, author));
		this.Author = author;
	};
	CDocument.prototype.getAuthor = function()
	{
		return this.Author;
	};
	CDocument.prototype.setDate = function(date)
	{
		if (this.Date === date)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentDate(this, this.Date, date));
		this.Date = date;
	};
	CDocument.prototype.getDate = function()
	{
		return this.Date;
	};
	CDocument.prototype.setDescription = function(description)
	{
		if (this.Description === description)
			return;

		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentDescription(this, this.Description, description));
		this.Description = description;
	};
	CDocument.prototype.getDescription = function()
	{
		return this.Description;
	};
	CDocument.prototype.setType = function(type)
	{
		if (this.Type === type)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentType(this, this.Type, type));
		this.Type = type;
	};
	CDocument.prototype.getType = function()
	{
		return this.Type;
	};
	CDocument.prototype.setApplication = function(app)
	{
		if (this.Application === app)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentApplication(this, this.Application, app));
		this.Application = app;
	};
	CDocument.prototype.getApplication = function()
	{
		return this.Application;
	};
	CDocument.prototype.setDocumentId = function(documentId)
	{
		if (this.DocumentId === documentId)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentDocumentId(this, this.DocumentId, documentId));
		this.DocumentId = documentId;
	};
	CDocument.prototype.getDocumentId = function()
	{
		return this.DocumentId;
	};
	CDocument.prototype.setFinal = function(isFinal)
	{
		if (this.Final === isFinal)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFinal(this, this.Final, isFinal));
		this.Final = isFinal;
		this.onChangeFinal();
	};
	CDocument.prototype.isFinal = function()
	{
		return this.Final;
	};
	CDocument.prototype.addFieldGroup = function(fieldGroup)
	{
		if (-1 !== this.FieldGroups.indexOf(fieldGroup))
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFieldGroup(this, fieldGroup.GetId(), true));
		this.FieldGroups.push(fieldGroup);
		fieldGroup.setParent(this);
		this.onChangeFieldGroups();
	};
	CDocument.prototype.removeFieldGroup = function(fieldGroup)
	{
		if (!fieldGroup)
			return;
		
		let index = this.FieldGroups.indexOf(fieldGroup);
		if (-1 === index)
			return;
		
		fieldGroup.setParent(null);
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFieldGroup(this, fieldGroup.GetId(), false));
		this.FieldGroups.splice(index, 1);
		this.onChangeFieldGroups();
	};
	CDocument.prototype.clearFieldGroups = function()
	{
		while (this.FieldGroups.length)
		{
			this.removeFieldGroup(this.FieldGroups[0]);
		}
	};
	CDocument.prototype.getFieldGroupsCount = function()
	{
		return this.FieldGroups.length;
	};
	CDocument.prototype.getFieldGroup = function(index)
	{
		if (index < 0 || index >= this.FieldGroups.length)
			return null;
		
		return this.FieldGroups[index];
	};
	CDocument.prototype.fromPkg = function(xmlPkg, opt_sdtPrWithFieldPath)
	{
		let xmlContext  = xmlPkg.getContext();
		let mainPart    = xmlPkg.getMainPart();
		let mainContent = mainPart ? mainPart.getDocumentContent() : null;
		if (mainContent)
		{
			let xmlParserContext = new AscCommon.XmlParserContext();
			xmlParserContext.setOformContext(xmlContext);
			let reader = new AscCommon.StaxParser(mainContent, mainPart, xmlParserContext);
			this.fromXml(reader);
		}
		
		let document = this;
		xmlContext.getAllUsers().forEach(function(user)
		{
			document.addUser(user)
		});
		xmlContext.getAllUserMasters().forEach(function(userMaster)
		{
			document.addUserMaster(userMaster);
		});
		xmlContext.getAllFieldMasters().forEach(function(fieldMaster)
		{
			document.addFieldMaster(fieldMaster);
		});
		//todo unite with XmlParserContext.prototype.assignFieldsToSdt
		if (opt_sdtPrWithFieldPath) {
			for (let nSdt = 0; nSdt < opt_sdtPrWithFieldPath.length; ++nSdt) {
				let oPair = opt_sdtPrWithFieldPath[nSdt];
				// let oFieldMaster = xmlContext.pathToFieldMaster[oPair.target];
				let oFieldMaster = xmlContext.getFieldMaster(oPair.target);
				if (oFieldMaster && oPair.sdt.SetFieldMaster) {
					oPair.sdt.SetFieldMaster(oFieldMaster);
				}
			}
		}
	};
	CDocument.prototype.toPkg = function(xmlPkg, opt_fieldMastersPartMap)
	{
		let xmlContext = xmlPkg.getContext();
		let xmlWriter  = xmlPkg.getXmlWriter();
		
		let main = xmlPkg.addPart(AscCommon.openXml.Types.oformMain).part;
		
		xmlWriter.Seek(0);
		main.setDataXml(this, xmlWriter);
		
		this.Users.forEach(function(user)
		{
			if (!xmlContext.haveUserPart(user))
			{
				xmlWriter.Seek(0);
				let part = xmlPkg.addPart(AscCommon.openXml.Types.oformUser);
				if (part)
					part.part.setDataXml(user, xmlWriter);
			}
		});
		
		this.UserMasters.forEach(function(userMaster)
		{
			if (!xmlContext.haveUserMasterPart(userMaster))
			{
				xmlWriter.Seek(0);
				let part = xmlPkg.addPart(AscCommon.openXml.Types.oformUserMaster);
				if (part)
					part.part.setDataXml(userMaster, xmlWriter);
			}
		});
		
		this.FieldMasters.forEach(function(fieldMaster)
		{
			if (!xmlContext.haveFieldMasterPart(fieldMaster))
			{
				xmlWriter.Seek(0);
				let part = xmlPkg.addPart(AscCommon.openXml.Types.oformFieldMaster);
				if (part)
				{
					part.part.setDataXml(fieldMaster, xmlWriter);
					if (opt_fieldMastersPartMap)
					{
						//todo remove path manipulation
						opt_fieldMastersPartMap[fieldMaster.Id] = '..'+part.part.uri;
					}
				}
			}
		});
	};
	CDocument.prototype.fromXml = function(reader)
	{
		this.clear();
		
		// TODO: Author, Date
		if (!reader.ReadNextNode() || "document" !== reader.GetNameNoNS())
			return false;
		
		let depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth))
		{
			switch(reader.GetNameNoNS())
			{
				case "author":
					break;
				case "date":
					break;
				case "description":
					this.setDescription(reader.GetTextDecodeXml());
					break;
				case "final":
					this.setFinal(reader.GetTextBool());
					break
				case "type":
					this.setType(reader.GetTextDecodeXml());
					break;
				case "application":
					this.setApplication(reader.GetTextDecodeXml());
					break;
				case "id":
					this.setDocumentId(reader.GetTextDecodeXml());
					break;
				case "fieldGroup":
					this.addFieldGroup(AscOForm.CFieldGroup.fromXml(reader));
					break;
				case "defaultUser":
				{
					while (reader.MoveToNextAttribute())
					{
						if ("r:id" === reader.GetName())
						{
							let xmlReaderContext = reader.GetOformContext();
							let rId = reader.GetValueDecodeXml();
							let rel = reader.rels.getRelationship(rId);
							let userMaster = xmlReaderContext.getUserMaster(rel.getFullPath());
							if (userMaster)
								this.setDefaultUser(userMaster);
						}
					}
					break;
				}
			}
		}
		
		return true;
	};
	CDocument.prototype.toXml = function(writer)
	{
		writer.WriteXmlHeader();
		writer.WriteXmlNodeStart("document");
		writer.WriteXmlRelationshipsNS();
		writer.WriteXmlAttributesEnd();
		
		// TODO: Author, Date
		
		let description = this.getDescription();
		if (description)
			writer.WriteXmlNodeWithText("description", description);
		
		let type = this.getType();
		if (type)
			writer.WriteXmlNodeWithText("type", type);
		
		let application = this.getApplication();
		if (application)
			writer.WriteXmlNodeWithText("application", application);
		
		if (this.isFinal())
			writer.WriteXmlNodeWithText("final", "1");
		
		let documentId = this.getDocumentId();
		if (documentId)
			writer.WriteXmlNodeWithText("id", documentId);
		
		let xmlContext      = writer.context;
		let defaultUserPart = xmlContext.getDefaultUserMasterPart(this.DefaultUser);
		if (defaultUserPart)
		{
			writer.WriteXmlNodeStart("defaultUser");
			writer.WriteXmlNullableAttributeString("r:id", xmlContext.getRId(defaultUserPart));
			writer.WriteXmlAttributesEnd(true);
		}
		
		for (let fgIndex = 0, fgCount = this.FieldGroups.length; fgIndex < fgCount; ++fgIndex)
		{
			this.FieldGroups[fgIndex].toXml(writer);
		}
		
		writer.WriteXmlNodeEnd("document");
	};
	/**
	 * @returns {AscOForm.CUserMaster}
	 */
	CDocument.prototype.getDefaultUserMaster = function()
	{
		return this.DefaultUser;
	};
	CDocument.prototype.addUser = function(user)
	{
		if (-1 !== this.Users.indexOf(user))
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentUser(this, user.GetId(), true));
		this.Users.push(user);
	};
	CDocument.prototype.removeUser = function(user)
	{
		let index = this.Users.indexOf(user);
		if (-1 === index)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentUser(this, user.GetId(), false));
		this.Users.splice(index, 1);
	};
	CDocument.prototype.getUserCount = function()
	{
		return this.Users.length;
	};
	/**
	 * @param index {number}
	 * @returns {?AscOForm.CUser}
	 */
	CDocument.prototype.getUser = function(index)
	{
		if (index < 0 || index >= this.Users.length)
			return null;
		
		return this.Users[index];
	};
	CDocument.prototype.clearUsers = function()
	{
		while (this.Users.length)
		{
			this.removeUser(this.Users[0]);
		}
	};
	CDocument.prototype.addUserMaster = function(userMaster)
	{
		if (-1 !== this.UserMasters.indexOf(userMaster))
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentUserMaster(this, userMaster.GetId(), true));
		this.UserMasters.push(userMaster);
		userMaster.setParent(this);
	};
	CDocument.prototype.removeUserMaster = function(userMaster)
	{
		let index = this.UserMasters.indexOf(userMaster);
		if (-1 === index)
			return;
		
		userMaster.setParent(null);
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentUserMaster(this, userMaster.GetId(), false));
		this.UserMasters.splice(index, 1);
	};
	CDocument.prototype.getUserMasterCount = function()
	{
		return this.UserMasters.length;
	};
	CDocument.prototype.getUserMaster = function(index)
	{
		if (index < 0 || index >= this.UserMasters.length)
			return null;
		
		return this.UserMasters[index];
	};
	CDocument.prototype.getAllUserMasters = function()
	{
		return this.UserMasters;
	};
	CDocument.prototype.clearUserMasters = function()
	{
		while (this.UserMasters.length)
		{
			this.removeUserMaster(this.UserMasters[0]);
		}
	};
	CDocument.prototype.createFieldMaster = function(id)
	{
		let fieldMaster = new AscOForm.CFieldMaster(!id);
		
		if (id)
			fieldMaster.setFieldId(id);
		
		this.addFieldMaster(fieldMaster);
		return fieldMaster;
	};
	CDocument.prototype.addFieldMaster = function(fieldMaster)
	{
		if (-1 !== this.FieldMasters.indexOf(fieldMaster))
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFieldMaster(this, fieldMaster.GetId(), true));
		this.FieldMasters.push(fieldMaster);
	};
	CDocument.prototype.removeFieldMaster = function(fieldMaster)
	{
		let index = this.FieldMasters.indexOf(fieldMaster);
		if (-1 === index)
			return;
		
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFieldMaster(this, fieldMaster.GetId(), false));
		this.FieldMasters.splice(index, 1);
	};
	CDocument.prototype.removeFieldMasterByIndex = function(index)
	{
		if (index < 0 || index >= this.FieldMasters.length)
			return;
		
		let fieldMaster = this.FieldMasters[index];
		AscCommon.History.Add(new AscDFH.CChangesOFormDocumentFieldMaster(this, fieldMaster.GetId(), false));
		this.FieldMasters.splice(index, 1);
	};
	CDocument.prototype.getFieldMasterCount = function()
	{
		return this.FieldMasters.length;
	};
	CDocument.prototype.getFieldMaster = function(index)
	{
		if (index < 0 || index >= this.FieldMasters.length)
			return null;
		
		return this.FieldMasters[index];
	};
	CDocument.prototype.clearFieldMasters = function()
	{
		while (this.FieldMasters.length)
		{
			this.removeFieldMaster(this.FieldMasters[0]);
		}
	};
	CDocument.prototype.getMinWeight = function()
	{
		let min = -1;
		for (let index = 0, count = this.FieldGroups.length; index < count; ++index)
		{
			let curWeight = this.FieldGroups[index].getWeight();
			if (-1 === min || min > curWeight)
				min = curWeight;
		}
		
		return min;
	};
	CDocument.prototype.getMaxWeight = function()
	{
		let max = -1;
		for (let index = 0, count = this.FieldGroups.length; index < count; ++index)
		{
			let curWeight = this.FieldGroups[index].getWeight();
			if (max < curWeight)
				max = curWeight;
		}
		
		return max;
	};
	CDocument.prototype.getAllFieldsByUserMaster = function(userMaster)
	{
		let fields = [];
		for (let index = 0, count = this.FieldMasters.length; index < count; ++index)
		{
			let fieldMaster = this.FieldMasters[index];
			if (fieldMaster.checkUser(userMaster))
				fields.push(fieldMaster);
		}
		
		return fields;
	};
	CDocument.prototype.onChangeFieldGroups = function()
	{
		if (!this.OForm)
			return;
		
		this.OForm.onChangeRoles();
	};
	CDocument.prototype.onChangeFieldGroup = function(fieldGroup)
	{
		if (!this.OForm)
			return;
		
		this.OForm.onChangeRoles();
	};
	CDocument.prototype.onChangeFieldGroupFilled = function(fieldGroup)
	{
		if (!this.OForm)
			return;
		
		this.OForm.onChangeFieldGroupFilled(fieldGroup);
	};
	CDocument.prototype.onChangeUserMaster = function(userMaster)
	{
		if (!this.OForm)
			return;
		
		this.OForm.onChangeRoles();
		this.OForm.onChangeRoleColor();
	};
	CDocument.prototype.correctFieldMasters = function(logicDocument)
	{
		if (!logicDocument)
			return;
		
		let formManager = logicDocument.GetFormsManager();
		let allForms    = formManager.GetAllForms();
		
		for (let index = 0, count = allForms.length; index < count; ++index)
		{
			let form = allForms[index];
			let fieldMaster = form.GetFieldMaster();
			if (!fieldMaster)
			{
				// TODO: Мы не можем здесь генерировать id, т.к. данная функция вызывается на открытии
				// и тогда у разных клиентов будут разные id. Поэтому, пока лучше вообще такие поля будут без id
				fieldMaster = new AscOForm.CFieldMaster(false);
				this.addFieldMaster(fieldMaster);
				fieldMaster.addUser(this.getDefaultUserMaster());
				form.SetFieldMaster(fieldMaster);
			}
			fieldMaster.setLogicField(form);
		}
		
		for (let fieldIndex = this.FieldMasters.length - 1; fieldIndex >= 0; --fieldIndex)
		{
			let fieldMaster = this.FieldMasters[fieldIndex];
			
			let form = fieldMaster.getLogicField();
			if (!form || form.GetFieldMaster() !== fieldMaster)
				this.removeFieldMasterByIndex(fieldIndex);
		}
	};
	CDocument.prototype.removeUnusedFieldMasters = function()
	{
		for (let fieldIndex = this.FieldMasters.length - 1; fieldIndex >= 0; --fieldIndex)
		{
			let fieldMaster = this.FieldMasters[fieldIndex];
			if (!fieldMaster.isUseInDocument())
				this.removeFieldMasterByIndex(fieldIndex);
		}
	};
	CDocument.prototype.onChangeFinal = function()
	{
		if (!this.OForm)
			return;
		
		this.OForm.sendEvent("asc_onOFormChangeFinal", this.isFinal());
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CDocument = CDocument;

})(window);
