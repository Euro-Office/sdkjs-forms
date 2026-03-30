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
	 * Базовый класс для всех форматных классов в oform
	 * @constructor
	 */
	function CBaseFormatObject()
	{
		this.Id = null;
		
		if (!AscCommon.g_oIdCounter.m_bLoad && !AscCommon.History.CanAddChanges())
			return;
		
		this.Id = AscCommon.g_oIdCounter.GetNewIdForOForm();
		AscCommon.g_oTableId.Add(this, this.Id);
	}
	CBaseFormatObject.prototype.GetId = function()
	{
		return this.Id;
	};
	CBaseFormatObject.prototype.Get_Id = function()
	{
		return this.Id;
	};
	CBaseFormatObject.prototype.Write_ToBinary2 = function(writer)
	{
		writer.WriteLong(this.classType);
		writer.WriteString2(this.GetId());
	};
	CBaseFormatObject.prototype.Read_FromBinary2 = function(reader)
	{
		this.Id = reader.GetString2();
	};
	CBaseFormatObject.prototype.Refresh_RecalcData = function(change)
	{
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscOForm.CBaseFormatObject = CBaseFormatObject;
	
})(window);
