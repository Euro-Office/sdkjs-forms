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
	 * Класс представляющий роль при заполнении формы. В данный момент роль - это ровно один userMaster
	 * и группа полей связанные с данным userMaster
	 * @param fieldGroup
	 * @param userMaster
	 * @constructor
	 */
	function CRole(fieldGroup, userMaster)
	{
		this.FieldGroup = fieldGroup;
		this.UserMaster = userMaster;
	}
	CRole.prototype.getSettings = function()
	{
		let r = new CRoleSettings();
		
		if (this.UserMaster)
		{
			r.setName(this.UserMaster.getRole());
			r.setColor(this.UserMaster.getColor());
		}

		if (this.FieldGroup)
			r.setFieldCount(this.FieldGroup.getAllFields().length)

		return r;
	};
	CRole.prototype.getRole = function()
	{
		return this.UserMaster.getRole();
	};
	CRole.prototype.getUserMaster = function()
	{
		return this.UserMaster;
	};
	CRole.prototype.getWeight = function()
	{
		return this.FieldGroup.getWeight();
	};
	CRole.prototype.setWeight = function(weight)
	{
		if (this.FieldGroup)
			this.FieldGroup.setWeight(weight);
	};
	CRole.prototype.isFilled = function()
	{
		return this.FieldGroup ? this.FieldGroup.isFilled() : true;
	};
	CRole.prototype.setFilled = function(isFilled)
	{
		if (!this.FieldGroup || isFilled === this.FieldGroup.isFilled())
			return;
		
		this.FieldGroup.setFilled(isFilled);
		
		if (isFilled)
		{
			this.FieldGroup.setDate(Date.now());
		}
		else
		{
			this.UserMaster.setUserId(AscCommon.CreateGUID());
			this.UserMaster.setUserName(undefined);
			this.UserMaster.setUserEmail(undefined);
			this.FieldGroup.setDate(undefined);
		}
	};
	CRole.prototype.getFieldGroup = function()
	{
		return this.FieldGroup;
	};
	
	/**
	 * Класс для задания настроек роли из интерфейса
	 * @constructor
	 */
	function CRoleSettings()
	{
		this.Name       = "";
		this.Color      = null;
		this.FieldCount = 0;
	}
	CRoleSettings.prototype.getName = function()
	{
		return this.Name;
	};
	CRoleSettings.prototype.setName = function(name)
	{
		this.Name = name;
	};
	CRoleSettings.prototype.setColor = function(color)
	{
		this.Color = color ? color.Copy() : null;
	};
	CRoleSettings.prototype.getColor = function()
	{
		return this.Color;
	};
	CRoleSettings.prototype.setAscColor = function(ascColor)
	{
		if (undefined === ascColor || null === ascColor)
			this.Color = null;
		else
			this.Color = new AscWord.CDocumentColor(ascColor.asc_getR(), ascColor.asc_getG(), ascColor.asc_getB());
	}
	CRoleSettings.prototype.getAscColor = function()
	{
		if (!this.Color)
			return null;
		
		return new Asc.asc_CColor(this.Color.r, this.Color.g, this.Color.b);
	};
	CRoleSettings.prototype.haveColor = function()
	{
		return (!!this.Color);
	};
	CRoleSettings.prototype.setFieldCount = function(count)
	{
		this.FieldCount = count;
	};
	CRoleSettings.prototype.getFieldCount = function()
	{
		return this.FieldCount;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CRole         = CRole;
	AscOForm.CRoleSettings = CRoleSettings;
	//---------------------------------------------interface export-----------------------------------------------------
	CRole.prototype['asc_getSettings']           = CRole.prototype.getSettings;
	window['AscCommon']["CRoleSettings"]         = CRoleSettings;
	CRoleSettings.prototype["asc_getName"]       = CRoleSettings.prototype.getName;
	CRoleSettings.prototype["asc_putName"]       = CRoleSettings.prototype.setName;
	CRoleSettings.prototype["asc_getColor"]      = CRoleSettings.prototype.getAscColor;
	CRoleSettings.prototype["asc_putColor"]      = CRoleSettings.prototype.setAscColor;
	CRoleSettings.prototype["asc_getFieldCount"] = CRoleSettings.prototype.getFieldCount;
})(window);
