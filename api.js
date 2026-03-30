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

var AscOForm = {};
window["AscOForm"] = window.AscOForm = AscOForm;

(function(window, document) {
    window['Asc']['Addons'] = window['Asc']['Addons'] || {};
	window['Asc']['Addons']['forms'] = true; // register addon
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlCheckBox'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlCheckBox = function(oPr, oFormPr, oCommonPr)
	{
		var oLogicDocument = this.private_GetLogicDocument();
		if (!oLogicDocument)
			return;
		
		CheckCurrentSelection(oLogicDocument);
		
		if (oPr && oFormPr)
		{
			if (oPr.GroupKey)
			{
				oPr.CheckedSymbol   = 0x25C9;
				oPr.UncheckedSymbol = 0x25CB;
			}
			else
			{
				oPr.CheckedSymbol   = 0x2611;
				oPr.UncheckedSymbol = 0x2610;
			}
			
			oPr.CheckedFont   = "Segoe UI Symbol";
			oPr.UncheckedFont = "Segoe UI Symbol";
		}
		
		
		var nCheckedSymbol   = oPr && oPr.CheckedSymbol ? oPr.CheckedSymbol : Asc.c_oAscSdtCheckBoxDefaults.CheckedSymbol;
		var nUncheckedSymbol = oPr && oPr.UncheckedSymbol ? oPr.UncheckedSymbol : Asc.c_oAscSdtCheckBoxDefaults.UncheckedSymbol;
		var sCheckedFont     = oPr && oPr.CheckedFont ? oPr.CheckedFont : Asc.c_oAscSdtCheckBoxDefaults.CheckedFont;
		var sUncheckedFont   = oPr && oPr.UncheckedFont ? oPr && oPr.UncheckedFont : Asc.c_oAscSdtCheckBoxDefaults.UncheckedFont;

		var isLoadFonts = false;
		if (!AscCommon.IsAscFontSupport(sCheckedFont, nCheckedSymbol))
		{
			isLoadFonts = true;
			AscFonts.FontPickerByCharacter.getFontBySymbol(nCheckedSymbol);
		}
		
		if (!AscCommon.IsAscFontSupport(sUncheckedFont, nUncheckedSymbol))
		{
			isLoadFonts = true;
			AscFonts.FontPickerByCharacter.getFontBySymbol(nUncheckedSymbol);
		}

		function private_ApplyPrToCheckBox(oCC, checkBoxPr)
		{
			if (!oCC)
				return;

			if (oFormPr)
			{
				private_ApplyFormPr(oCC, oFormPr, oLogicDocument);
				
				if (oPr && oPr.GroupKey)
					private_CheckRadioButtonChoice(oCC, oLogicDocument, oPr.GroupKey);
				else
					private_CheckFormKey(oCC, oLogicDocument);
			}
			
			if (oCommonPr)
				oCC.SetContentControlPr(oCommonPr);
		}
		
		function private_PerformAddCheckBox()
		{

			if (oLogicDocument.IsTextSelectionUse())
			{
				let arrSelectedParagraphs = oLogicDocument.GetSelectedParagraphs();

				// Select entire paragraphs so that after the action all added checkboxes are included in the selection
				let nSelectDirection = oLogicDocument.GetSelectDirection();
				for (let nIndex = 0, nCount = arrSelectedParagraphs.length; nIndex < nCount; ++nIndex)
				{
					arrSelectedParagraphs[nIndex].SelectAll(nSelectDirection);
				}

				let oState = oLogicDocument.SaveDocumentState(false);

				if (arrSelectedParagraphs.length > 0
					&& !oLogicDocument.IsSelectionLocked(AscCommon.changestype_None, {
					Type      : AscCommon.changestype_2_ElementsArray_and_Type,
					Elements  : arrSelectedParagraphs,
					CheckType : AscCommon.changestype_Paragraph_Content
				}))
				{
					oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlCheckBox, undefined, undefined, true);
					oLogicDocument.RemoveSelection();

					for (let nIndex = 0, nCount = arrSelectedParagraphs.length; nIndex < nCount; ++nIndex)
					{
						let oCC = arrSelectedParagraphs[nIndex].AddCheckBoxToStartPos(oPr);
						private_ApplyPrToCheckBox(oCC, oPr);
					}

					oLogicDocument.LoadDocumentState(oState);
					oLogicDocument.UpdateInterface();
					oLogicDocument.Recalculate();
					oLogicDocument.FinalizeAction();
				}
				else
				{
					oLogicDocument.LoadDocumentState(oState);
				}
			}
			else
			{
				oLogicDocument.RemoveTextSelection();
				if (!oLogicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
				{
					oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlCheckBox, undefined, undefined, true);

					var oCC = oLogicDocument.AddContentControlCheckBox(oPr);
					private_ApplyPrToCheckBox(oCC, oPr);

					oLogicDocument.UpdateInterface();
					oLogicDocument.Recalculate();
					oLogicDocument.FinalizeAction();
				}
			}
		}
		
		if (isLoadFonts)
		{
			var oFonts = {};
			oFonts[sCheckedFont]   = true;
			oFonts[sUncheckedFont] = true;
			
			AscCommon.Check_LoadingDataBeforePrepaste(this, oFonts, {}, private_PerformAddCheckBox);
		}
		else
		{
			private_PerformAddCheckBox();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlPicture'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlPicture = function(oFormPr, oCommonPr, isSignature)
	{
		var oLogicDocument = this.private_GetLogicDocument();
		if (!oLogicDocument)
			return;
		
		CheckCurrentSelection(oLogicDocument);

		oLogicDocument.RemoveTextSelection();
		if (!oLogicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
		{
			oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlPicture, undefined, undefined, true);

			// 150x32pt for Signature
			let w = isSignature ? 150 / 72 * 25.4 : undefined;
			let h = isSignature ? 32 / 72 * 25.4 : undefined;
			
			var oCC = oLogicDocument.AddContentControlPicture(w, h);
			
			// MSWord can't open files with anchored picture content controls (70332)
			if (oCC && !oFormPr)
			{
				let allDrawings = oCC.GetAllDrawingObjects();
				for (let i = 0; i < allDrawings.length; ++i)
				{
					allDrawings[i].MakeInline();
				}
			}
			
			let oFormParaDrawing = null;
			if (oCC && oFormPr)
			{
				oCC.SetFormPr(oFormPr);
				oCC.UpdatePlaceHolderTextPrForForm();
				let pictPr = new AscCommon.CSdtPictureFormPr();
				if (isSignature)
				{
					pictPr.SetSignature(true);
					let glossary = oLogicDocument.GetGlossaryDocument();
					if (glossary)
						oCC.SetPlaceholder(glossary.GetDefaultPlaceholderSignatureOformDocPartId());
				}
				
				oCC.SetPictureFormPr(pictPr);
				
				private_CheckFormKey(oCC, oLogicDocument);
				oLogicDocument.Recalculate(true);
				oFormParaDrawing = oCC.ConvertFormToFixed();
				
				var aDrawings = oCC.GetAllDrawingObjects();
				for(var nDrawing = 0; nDrawing < aDrawings.length; ++nDrawing)
				{
					var oDrawing = aDrawings[nDrawing];
					var oGraphic = oDrawing.GraphicObj;
					if(oGraphic && oGraphic.getObjectType() === AscDFH.historyitem_type_ImageShape)
					{
						var oSpPr = oGraphic.spPr;
						if(oSpPr)
						{
							if(oSpPr.Fill)
							{
								oSpPr.setFill(null);
							}
							if(oSpPr.ln)
							{
								oSpPr.setLn(null);
							}
							if(oSpPr.geometry)
							{
								oSpPr.setGeometry(null);
							}
							var oXfrm = oSpPr.xfrm;
							if(oXfrm)
							{
								if(!AscFormat.fApproxEqual(oXfrm.rot, 0.0))
								{
									oXfrm.setRot(0);
								}
								if(oXfrm.flipH)
								{
									oXfrm.setFlipH(false);
								}
								if(oXfrm.flipH)
								{
									oXfrm.setFlipH(false);
								}
								if(oXfrm.flipV)
								{
									oXfrm.setFlipV(false);
								}
							}
						}
					}
				}

				if (!oCC.IsPlaceHolder())
				{
					oLogicDocument.Recalculate(true);
					oCC.UpdatePictureFormLayout();
				}
				else
				{
					oCC.ReplaceContentWithPlaceHolder();
					oCC.ApplyPicturePr(true, w, h);
				}
			}

			if (oCC && oCommonPr)
				oCC.SetContentControlPr(oCommonPr);

			oLogicDocument.UpdateInterface();
			oLogicDocument.Recalculate();
			if(oFormParaDrawing)
			{
				let oFormShape = oFormParaDrawing.GraphicObj;
				if(oFormShape)
				{
					oFormShape.Set_CurrentElement(true, null, true);
				}
			}
 			oLogicDocument.FinalizeAction();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlSignature'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlSignature = function(oFormPr, oCommonPr)
	{
		return this.asc_AddContentControlPicture(oFormPr, oCommonPr, true);
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlList'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlList = function(isComboBox, oPr, oFormPr, oCommonPr)
	{
		var oLogicDocument = this.private_GetLogicDocument();
		if (!oLogicDocument)
			return;
		
		CheckCurrentSelection(oLogicDocument);

		oLogicDocument.RemoveTextSelection();
		if (!oLogicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
		{
			oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlList);

			var oCC;
			if (isComboBox)
				oCC = oLogicDocument.AddContentControlComboBox(oPr);
			else
				oCC = oLogicDocument.AddContentControlDropDownList(oPr);

			if (oCC && oFormPr)
			{
				private_ApplyFormPr(oCC, oFormPr, oLogicDocument);
				oCC.UpdatePlaceHolderTextPrForForm();
				private_CheckFormKey(oCC, oLogicDocument);
			}

			if (oCC && oCommonPr)
				oCC.SetContentControlPr(oCommonPr);

			oLogicDocument.AddMacroData(AscDFH.historydescription_Document_AddContentControlList, {isComboBox : isComboBox});
			oLogicDocument.Recalculate();
			oLogicDocument.UpdateInterface();
			oLogicDocument.UpdateSelection();
			oLogicDocument.FinalizeAction();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlDatePicker'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlDatePicker = function(oPr, oCommonPr)
	{
		var oLogicDocument = this.private_GetLogicDocument();
		if (!oLogicDocument)
			return;
		
		CheckCurrentSelection(oLogicDocument);

		oLogicDocument.RemoveTextSelection();
		if (!oLogicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
		{
			oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlDatePicker, undefined, undefined, true);
			
			let dateTimePr = null;
			let formPr     = null;
			let ccPr       = null;
			
			// Пока для совместимости со старым форматом оставляем, чтобы настройки могли приходить по старому (oPr, oCommonPr)
			// но в будущем надо перейти на новый вариант contentPr (AscCommon.CContentControlPr)
			if (oPr && (oPr instanceof AscCommon.CContentControlPr))
			{
				dateTimePr = oPr.DateTimePr;
				ccPr       = oPr;
				formPr     = oPr.FormPr;
			}
			else if (oPr && (oPr instanceof AscWord.CSdtDatePickerPr))
			{
				dateTimePr = oPr;
				ccPr       = oCommonPr ? oCommonPr : null;
			}
			
			var oCC = oLogicDocument.AddContentControlDatePicker(dateTimePr);

			if (oCC && ccPr)
				oCC.SetContentControlPr(ccPr);
			
			if (oCC && formPr)
			{
				private_ApplyFormPr(oCC, formPr, oLogicDocument);
				private_CheckFormKey(oCC, oLogicDocument);
			}

			oLogicDocument.Recalculate();
			oLogicDocument.UpdateInterface();
			oLogicDocument.UpdateSelection();
			oLogicDocument.FinalizeAction();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddContentControlTextForm'] = window['Asc']['asc_docs_api'].prototype.asc_AddContentControlTextForm = function(contentControlPr)
	{
		var oLogicDocument = this.private_GetLogicDocument();
		if (!oLogicDocument)
			return;
		
		CheckCurrentSelection(oLogicDocument);

		let textFormPr      = contentControlPr ? contentControlPr.TextFormPr : null;
		let formPr          = contentControlPr ? contentControlPr.FormPr : null;
		let placeholderText = contentControlPr ? contentControlPr.PlaceholderText : "";

		if (!oLogicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
		{
			oLogicDocument.StartAction(AscDFH.historydescription_Document_AddContentControlTextForm);

			var oCC = oLogicDocument.AddContentControlTextForm(textFormPr);
			if (oCC)
			{
				if (placeholderText)
					oCC.SetPlaceholderText(placeholderText);

				if (formPr)
				{
					private_ApplyFormPr(oCC, formPr, oLogicDocument);
					oCC.UpdatePlaceHolderTextPrForForm();
					private_CheckFormKey(oCC, oLogicDocument);
				}
			}

			oLogicDocument.UpdateInterface();
			oLogicDocument.Recalculate();
			oLogicDocument.FinalizeAction();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_AddComplexForm'] = window['Asc']['asc_docs_api'].prototype.asc_AddComplexForm = function(json, formPr)
	{
		let logicDocument = this.private_GetLogicDocument();
		if (!logicDocument)
			return;
		
		CheckCurrentSelection(logicDocument, true);

		function AddComplexForm()
		{
			if (!logicDocument.IsSelectionLocked(AscCommon.changestype_Paragraph_Content))
			{
				logicDocument.StartAction(AscDFH.historydescription_Document_AddComplexForm);

				let complexForm = logicDocument.AddComplexForm(new AscWord.CSdtComplexFormPr(), formPr);
				private_CheckFormKey(complexForm, logicDocument);

				if (json)
					AscWord.JsonToForm(json, complexForm);

				logicDocument.UpdateInterface();
				logicDocument.Recalculate();
				logicDocument.FinalizeAction();
			}
		}

		if (json)
		{
			AscFonts.FontPickerByCharacter.checkText(AscWord.GetUnicodesFromJsonToForm(), this, function() {
				AddComplexForm();
			}, true);
		}
		else
		{
			AddComplexForm();
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_GetCurrentComplexForm'] = window['Asc']['asc_docs_api'].prototype.asc_GetCurrentComplexForm = function()
	{
		let logicDocument = this.private_GetLogicDocument();
		if (!logicDocument)
			return null;

		let form = logicDocument.GetContentControl();
		if (!form || !form.IsForm())
			return null;

		let mainForm = form.GetMainForm();
		if (!mainForm || !mainForm.IsComplexForm() || mainForm.IsLabeledCheckBox())
			return null;

		return mainForm;
	};
	window['Asc']['asc_docs_api'].prototype['asc_ConvertFormToJson'] = window['Asc']['asc_docs_api'].prototype.asc_ConvertFormToJson = function(form)
	{
		let logicDocument = this.private_GetLogicDocument();
		if (!logicDocument)
			return null;

		if (typeof (form) === "string")
			form = AscCommon.g_oTableId.Get_ById(form);

		if (!form || !(form instanceof AscWord.CInlineLevelSdt) || !form.IsForm())
			return null;

		return AscWord.FormToJson(form);
	};
	window['Asc']['asc_docs_api'].prototype['asc_SetFormValue'] = window['Asc']['asc_docs_api'].prototype.asc_SetFormValue = function(value, formId)
	{
		let logicDocument = this.private_GetLogicDocument();
		if (!logicDocument)
			return;
		
		let form = logicDocument.GetContentControl(formId);
		if (!form || !form.IsForm())
			return;
		
		if (typeof(value) === "string")
		{
			let _t = this;
			AscFonts.FontPickerByCharacter.checkText(value, this, function() {
				_t.private_SetFormValue(form.GetId(), value);
			});
		}
		else
		{
			this.private_SetFormValue(form.GetId(), value);
		}
	};
	window['Asc']['asc_docs_api'].prototype['asc_GetFormValue'] = window['Asc']['asc_docs_api'].prototype.asc_GetFormValue = function(formId)
	{
		let logicDocument = this.private_GetLogicDocument();
		if (!logicDocument)
			return "";
		
		let form = logicDocument.GetContentControl(formId);
		if (!form || !form.IsForm())
			return "";
		
		if (form.IsPictureForm())
			return "";
		else if (form.IsCheckBox())
			return form.IsCheckBoxChecked();
		else if (form.IsPlaceHolder())
			return "";
		
		return form.GetInnerText();
	};
	window['Asc']['asc_docs_api'].prototype.private_SetFormValue = function(internalId, value)
	{
		let oLogicDocument = this.private_GetLogicDocument();
		
		if (!AscCommon.g_oTableId
			|| !oLogicDocument
			|| !oLogicDocument.IsDocumentEditor())
			return;
		
		let oForm = AscCommon.g_oTableId.GetClass(internalId);
		
		if (!oForm
			|| !(oForm instanceof AscWord.CInlineLevelSdt)
			|| !oForm.IsForm())
			return;
		
		// При проверке лока внутри параграфа мы ориентируемся на выделение внутри этого параграфа
		// поэтому нужно выделить форму
		let state = oLogicDocument.SaveDocumentState();
		oForm.SelectContentControl();
		
		let oParagraph = oForm.GetParagraph();
		
		oForm.SkipFillingFormModeCheck(true);
		oForm.SkipSpecialContentControlLock(true);
		if (!oParagraph
			|| oLogicDocument.IsSelectionLocked(AscCommon.changestype_None, {
				Type      : AscCommon.changestype_2_ElementsArray_and_Type,
				Elements  : [oParagraph],
				CheckType : AscCommon.changestype_Paragraph_Content
			}, true, oLogicDocument.IsFillingFormMode()))
		{
			oLogicDocument.LoadDocumentState(state);
			oForm.SkipFillingFormModeCheck(false);
			oForm.SkipSpecialContentControlLock(false);
			return;
		}
		oLogicDocument.LoadDocumentState(state);
		oForm.SkipFillingFormModeCheck(false);
		oForm.SkipSpecialContentControlLock(false);
		
		oLogicDocument.StartAction(AscDFH.historydescription_Document_FillFormInPlugin);
		
		let isClear = false;
		if (null === value)
		{
			isClear = true;
		}
		else if (oForm.IsTextForm() || oForm.IsComboBox())
		{
			let sValue = AscBuilder.GetStringParameter(value, "");
			if (!sValue)
				isClear = true;
			else
				oForm.SetInnerText(sValue);
		}
		else if (oForm.IsDropDownList())
		{
			let sValue = AscBuilder.GetStringParameter(value, "");
			let oPr    = oForm.GetDropDownListPr();
			let nIndex = oPr.FindByText(sValue);
			if (-1 !== nIndex)
				oForm.SelectListItem(oPr.GetItemValue(nIndex));
			else
				isClear = true;
		}
		else if (oForm.IsCheckBox())
		{
			let isChecked = value === "true" ? true : value === "false" ? false : AscBuilder.GetBoolParameter(value, null);
			if (null !== isChecked)
				oForm.SetCheckBoxChecked(isChecked);
			else
				isClear = true;
		}
		else if (oForm.IsPictureForm())
		{
			let sValue = AscBuilder.GetStringParameter(value, "");
			if (!sValue)
				return;
			
			let oImg;
			let allDrawings = oForm.GetAllDrawingObjects();
			for (let nDrawing = 0; nDrawing < allDrawings.length; ++nDrawing)
			{
				if (allDrawings[nDrawing].IsPicture())
				{
					oImg = allDrawings[nDrawing].GraphicObj;
					break;
				}
			}
			
			if (oImg)
			{
				oForm.SetShowingPlcHdr(false);
				oImg.setBlipFill(AscFormat.CreateBlipFillRasterImageId(sValue));
			}
			else
			{
				isClear = true;
			}
		}
		else if (oForm.IsDatePicker())
		{
			let sValue = AscBuilder.GetStringParameter(value, "");
			if (!sValue)
				isClear = true;
			else
				oForm.SetInnerText(sValue);
			
			// TODO: Надо FullDate попытаться выставить по заданному значение. Сейчас мы всегда сбрасываем на текущую дату
			 let datePickerPr = oForm.GetDatePickerPr().Copy();
			 datePickerPr.SetFullDate(null);
			 oForm.SetDatePickerPr(datePickerPr);
		}
		
		if (isClear)
			oForm.ClearContentControlExt();
		
		oLogicDocument.OnChangeForm(oForm);
		oLogicDocument.Recalculate();
		oLogicDocument.UpdateTracks();
		oLogicDocument.UpdateInterface();
		oLogicDocument.FinalizeAction();
	};

	function private_CheckFormKey(form, logicDocument)
	{
		if (!form || !form.IsForm() || !logicDocument)
			return;

		let key = form.GetFormKey();
		if (key && "" !== key.trim())
			return;

		let formManager  = logicDocument.GetFormsManager();
		let keyGenerator = formManager.GetKeyGenerator();

		let formPr = form.GetFormPr().Copy();
		if (!formPr)
			return;

		key = keyGenerator.GetNewKey(form);
		formPr.SetKey(key);
		form.SetFormPr(formPr);
	}
	function private_CheckRadioButtonChoice(form, logicDocument, groupKey)
	{
		if (!form || !form.IsForm() || !logicDocument)
			return;
		
		let choice = form.GetFormKey();
		if (choice && "" !== choice.trim())
			return;
		
		let formManager  = logicDocument.GetFormsManager();
		let keyGenerator = formManager.GetKeyGenerator();
		
		form.SetFormRequired(formManager.IsRadioGroupRequired(groupKey));
		
		let formPr = form.GetFormPr().Copy();
		if (!formPr)
			return;
		
		choice = keyGenerator.GetNewChoiceByGroupKey(groupKey);
		formPr.SetKey(choice);
		form.SetFormPr(formPr);
	}
	function private_ApplyFormPr(form, formPr, logicDocument)
	{
		if (!form || !formPr)
			return;
		
		form.SetFormPr(formPr.Copy());
		
		if (!form.IsMainForm() && form.GetMainForm().GetFormRole() !== formPr.GetRole())
			form.SetFormRole(form.GetMainForm().GetFormRole());
		
		let docPartId = form.GetPlaceholder();
		let glossary  = logicDocument.GetGlossaryDocument();
		if ((form.IsTextForm()
				|| form.IsDropDownList()
				|| form.IsComboBox()
				|| form.IsDatePicker())
			&&
			(docPartId === glossary.GetDefaultPlaceholderTextDocPartId()
				|| docPartId === glossary.GetDefaultPlaceholderListDocPartId()
				|| docPartId === glossary.GetDefaultPlaceholderDateTimeDocPartId()))
		{
			if (docPartId === glossary.GetDefaultPlaceholderTextDocPartId())
				form.SetPlaceholder(glossary.GetDefaultPlaceholderTextOformDocPartId());
			else if (docPartId === glossary.GetDefaultPlaceholderListDocPartId())
				form.SetPlaceholder(glossary.GetDefaultPlaceholderListOformDocPartId());
			else if (docPartId === glossary.GetDefaultPlaceholderDateTimeDocPartId())
				form.SetPlaceholder(glossary.GetDefaultPlaceholderDateTimeOformDocPartId());

			if (form.IsPlaceHolder())
				form.private_FillPlaceholderContent();
		}
		
		let paragraph = form.GetParagraph();
		if (form.IsMainForm() && formPr.GetFixed() && (!paragraph || !paragraph.GetParentShape()))
		{
			logicDocument.Recalculate(true);
			let drawing = form.ConvertFormToFixed();
			if (drawing)
				drawing.SelectAsDrawing();
		}
	}
	
	function CheckCurrentSelection(logicDocument, isComplex)
	{
		let form = logicDocument.GetContentControl();
		
		let mainForm = form ? form.GetMainForm() : null;
		if (mainForm && mainForm.IsLabeledCheckBox())
			return mainForm.MoveCursorOutsideForm(false);
		
		if (!form || !form.IsForm() || (form.IsComplexForm() && !isComplex))
			return;
		
		if (isComplex)
			form = form.GetMainForm();
		
		form.MoveCursorOutsideForm(false);
	}

})(window, window.document);
