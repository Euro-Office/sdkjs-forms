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
	 * Базовое изменение для работы с каким-либо контейнером, в который по ключу-key (string)
	 * добавляют/удаляют значение
	 * @constructor
	 * @extends {window['AscDFH'].CChangesBase}
	 */
	function CChangesDictionaryBase(Class, key, isAdd)
	{
		AscDFH.CChangesBase.call(this, Class);
		this.Key = key;
		this.Add = isAdd;
	}
	CChangesDictionaryBase.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDictionaryBase.prototype.constructor = CChangesDictionaryBase;
	CChangesDictionaryBase.prototype.Redo = function()
	{
		if (this.Add)
			this.private_AddToDictionary();
		else
			this.private_RemoveFromDictionary();
	};
	CChangesDictionaryBase.prototype.Undo = function()
	{
		if (this.Add)
			this.private_RemoveFromDictionary();
		else
			this.private_AddToDictionary();
	};
	CChangesDictionaryBase.prototype.WriteToBinary = function(writer)
	{
		writer.WriteString2(this.Key);
		writer.WriteBool(this.Add);
	};
	CChangesDictionaryBase.prototype.ReadFromBinary = function(reader)
	{
		this.Key = reader.GetString2();
		this.Add = reader.GetBool();
	};
	CChangesDictionaryBase.prototype.IsNeedRecalculate = function()
	{
		return false;
	};
	CChangesDictionaryBase.prototype.CreateReverseChange = function()
	{
		return new this.constructor(this.Class, this.Key, !this.Add);
	};
	CChangesDictionaryBase.prototype.private_AddToDictionary = function()
	{
	};
	CChangesDictionaryBase.prototype.private_RemoveFromDictionary = function()
	{
	};
	window['AscDFH'].CChangesDictionaryBase = CChangesDictionaryBase;

	function InheritDictionaryChange(changeClass, type, addFunction, removeFunction)
	{
		window['AscDFH'].changesFactory[type] = changeClass;

		changeClass.prototype                              = Object.create(CChangesDictionaryBase.prototype);
		changeClass.prototype.constructor                  = changeClass;
		changeClass.prototype.Type                         = type;
		changeClass.prototype.private_AddToDictionary      = addFunction;
		changeClass.prototype.private_RemoveFromDictionary = removeFunction;
	}
	window['AscDFH'].InheritDictionaryChange = InheritDictionaryChange;

})(window);
