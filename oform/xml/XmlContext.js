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
	const PATH_USERS         = "/users/";
	const PATH_USER_MASTERS  = "/userMasters/";
	const PATH_FIELDS        = "/fields/";
	const PATH_FIELD_MASTERS = "/fieldMasters/";
	
	/**
	 * Класс для работы с ссылками внутри xml структуры во время чтения
	 * @constructor
	 */
	function XmlReaderContext(pkg)
	{
		this.pkg = pkg;
		
		this.pathToUser        = {};
		this.pathToUserMaster  = {};
		this.pathToField       = {};
		this.pathToFieldMaster = {};
	}
	XmlReaderContext.prototype.getOformContext = function()
	{
		return this;
	};
	XmlReaderContext.prototype.getUser = function(path)
	{
		let user = this.pathToUser[path];
		if (user)
			return user;
		
		let reader = this.getXmlReader(path);
		if (!reader)
			return null;
		
		user = AscOForm.CUser.fromXml(reader);
		this.pathToUser[path] = user;
		return user;
	};
	XmlReaderContext.prototype.getUserMaster = function(path)
	{
		let userMaster = this.pathToUserMaster[path];
		if (userMaster)
			return userMaster;
		
		let reader = this.getXmlReader(path);
		if (!reader)
			return null;
		
		userMaster = AscOForm.CUserMaster.fromXml(reader);
		this.pathToUserMaster[path] = userMaster;
		return userMaster;
	};
	XmlReaderContext.prototype.getField = function(path)
	{
		let field = this.pathToField[path];
		if (field)
			return field;
		
		let reader = this.getXmlReader(path);
		if (!reader)
			return null;
		
		return null;

		// TODO: implement
		// field = AscOForm.CField.fromXml(reader);
		// this.pathToField[path] = field;
		// return field;
	};
	XmlReaderContext.prototype.getFieldMaster = function(path)
	{
		let fieldMaster = this.pathToFieldMaster[path];
		if (fieldMaster)
			return fieldMaster;
		
		let reader = this.getXmlReader(path);
		if (!reader)
			return null;
		
		fieldMaster = AscOForm.CFieldMaster.fromXml(reader);
		this.pathToFieldMaster[path] = fieldMaster;
		return fieldMaster;
	};
	XmlReaderContext.prototype.getAllUsers = function()
	{
		return this.getAllByMapAndPath(this.pathToUser, PATH_USERS, AscOForm.CUser.fromXml);
	};
	XmlReaderContext.prototype.getAllUserMasters = function()
	{
		return this.getAllByMapAndPath(this.pathToUserMaster, PATH_USER_MASTERS, AscOForm.CUserMaster.fromXml);
	};
	XmlReaderContext.prototype.getAllFields = function()
	{
		// TODO: Implement
		return [];
		//return this.getAllByMapAndPath(this.pathToField, PATH_FIELDS, AscOForm.CField.fromXml);
	};
	XmlReaderContext.prototype.getAllFieldMasters = function()
	{
		return this.getAllByMapAndPath(this.pathToFieldMaster, PATH_FIELD_MASTERS, AscOForm.CFieldMaster.fromXml);
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	XmlReaderContext.prototype.getXmlReader = function(path)
	{
		let part = this.pkg.getPartByUri(path);
		if (!part)
			return null;
		
		let partContent = part.getDocumentContent();
		if (!partContent)
			return null;

		let xmlParserContext = new AscCommon.XmlParserContext();
		xmlParserContext.setOformContext(this);
		return new AscCommon.StaxParser(partContent, part, xmlParserContext);
	};
	XmlReaderContext.prototype.getAllByMapAndPath = function(map, path, fromXml)
	{
		let result = [];
		for (let key in map)
		{
			result.push(map[key]);
		}
		
		for (let uri in this.pkg.parts)
		{
			if (uri.startsWith(path)
				&& uri.endsWith(".xml")
				&& !map[uri])
			{
				let reader = this.getXmlReader(uri);
				if (!reader)
					return;
				
				let element = fromXml(reader);
				if (element)
				{
					map[uri] = element;
					result.push(element);
				}
			}
		}
		
		return result;
	}
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.XmlReaderContext = XmlReaderContext;
	
	
	/**
	 * Класс для работы с ссылками внутри xml структуры во время записи
	 * @constructor
	 */
	function XmlWriterContext(pkg)
	{
		this.pkg = pkg;
		
		this.userToPart        = {};
		this.userMasterToPart  = {};
		this.fieldToPart       = {};
		this.fieldMasterToPart = {};
		
		this.partToRId = {};
	}
	XmlWriterContext.prototype.clearCurrentPartDataMaps = function()
	{
		this.partToRId = {};
	};
	XmlWriterContext.prototype.getRId = function(part)
	{
		if (this.partToRId[part.uri])
			return this.partToRId[part.uri];
		
		if (!this.part)
			return "";
		
		let target = part.uri;
		let base   = this.part.uri;
		
		if (target.startsWith('/'))
			target = target.substring(1);
		if (base.startsWith('/'))
			base = base.substring(1);
		
		let baseSplit   = base.split('/');
		let targetSplit = target.split('/');
		
		while (baseSplit.length && targetSplit.length && baseSplit[0] === targetSplit[0])
		{
			baseSplit.shift();
			targetSplit.shift()
		}
		
		let relative = "";
		for (let index = 0, count = baseSplit.length - 1; index < count; ++index)
		{
			relative += "../";
		}
		
		relative += targetSplit.join('/');
		
		let rId = this.part.addRelationship(null, relative);
		this.partToRId[part.uri] = rId;
		return rId;
	};
	XmlWriterContext.prototype.getUserPart = function(user)
	{
		return this.getPartFromPkg(this.userToPart, user, AscCommon.openXml.Types.oformUser);
	};
	XmlWriterContext.prototype.haveUserPart = function(user)
	{
		return !!this.userToPart[user.GetId()];
	};
	XmlWriterContext.prototype.getUserMasterPart = function(userMaster)
	{
		return this.getPartFromPkg(this.userMasterToPart, userMaster, AscCommon.openXml.Types.oformUserMaster);
	};
	XmlWriterContext.prototype.getDefaultUserMasterPart = function(userMaster)
	{
		return this.getPartFromPkg(this.userMasterToPart, userMaster, AscCommon.openXml.Types.oformDefaultUserMaster);
	};
	XmlWriterContext.prototype.haveUserMasterPart = function(userMaster)
	{
		return !!this.userMasterToPart[userMaster.GetId()];
	};
	XmlWriterContext.prototype.getFieldPart = function(field)
	{
		return this.getPartFromPkg(this.fieldToPart, field, AscCommon.openXml.Types.oformField);
	};
	XmlWriterContext.prototype.haveFieldPart = function(field)
	{
		return !!this.fieldToPart[field.GetId()];
	};
	XmlWriterContext.prototype.getFieldMasterPart = function(fieldMaster)
	{
		return this.getPartFromPkg(this.fieldMasterToPart, fieldMaster, AscCommon.openXml.Types.oformFieldMaster);
	};
	XmlWriterContext.prototype.haveFieldMasterPart = function(fieldMaster)
	{
		return !!this.fieldMasterToPart[fieldMaster];
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	XmlWriterContext.prototype.getPartFromPkg = function(map, object, contentType)
	{
		let objectId = object.GetId();
		if (map[objectId])
			return map[objectId];
		
		let part = this.pkg.addPart(contentType).part;
		
		let xmlWriter = new AscCommon.CMemory();
		xmlWriter.context = this;
		
		part.setDataXml(object, xmlWriter);
		
		map[objectId] = part;
		return part;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.XmlWriterContext = XmlWriterContext;
	
})(window);
