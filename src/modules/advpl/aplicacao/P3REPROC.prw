#Include 'Protheus.ch'
#Include "RESTFUL.CH"
#Include "FWMVCDEF.CH"
#INCLUDE "RWMAKE.CH"
#INCLUDE "TBICONN.CH"
#include 'topconn.ch'


User Function P3REPROC(lTodos)

	Processa( {|| U_XP3REPROC(lTodos) }, "Aguarde...", "Reprocessando...",.F.)

Return

User Function XP3REPROC(lTodos)
	Local lJob 		:= .F.
	Local oModel 	:= FWModelActivate()
	Local cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Local oView     := FWViewActive()
	Local cQuery    := ""
	Private aId		:= oView:GetCurrentSelect()
	Private cId		:= SubStr(aId[1],At("_FILHO",aId[1]),7)
	Private oParseJSON

	IF !"_FILHO" $ cID
		MsgInfo("Se posicione no registro desejado!")
		Return
	Endif

	Private oGrid 	:= oModel:GetModel(cTmpImp+cID)
	Private nOpc 	:= oGrid:GetValue(cTmpImp+"_OPER")
	Private cChave 	:= oGrid:GetValue(cTmpImp+"_CHAVE")
	Private cJSon 	:= oGrid:GetValue(cTmpImp+"_JSON")
	Private nLinha  := oGrid:GetLine()
	Private nRecno  := oGrid:GetDataId(nLinha)


	IF !lTodos
		dbSelectArea(cTmpImp)
		(cTmpImp)->(dbGoTo(nRecno))

		ProcRegua(1)

		If &(cTmpImp+"_STATUS") <> "P"
			If &(cTmpImp+"_EMUSO") <> "S"
				IncProc()
				//Trava registro
				RecLock(cTmpImp,.F.)
				(cTmpImp)->&(cTmpImp+"_EMUSO") := "S"
				(cTmpImp)->(MsUnlock())

				IF nOpc == "I"
					nOpc := 3
				Else
					nOpc := 4
				Endif

				FWJsonDeserialize(cJSon, @oParseJSON)

				Do Case
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SF1"
					FWMsgRun(, {|oSay| U_P3GERNF(nOpc,cChave,lJob,oSay) }, "Aguarde", "Reprocessando Nota Fiscal...")
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SE2"
					MsgInfo("Este processo é integrado online, não pode ser reprocessado!")
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SC7"
					FWMsgRun(, {|oSay| U_P3GERSC7(nOpc,cChave,lJob,oSay) }, "Aguarde", "Reprocessando Pedido de Compra...")
				EndCase

				//Libera registro
				RecLock(cTmpImp,.F.)
				(cTmpImp)->&(cTmpImp+"_EMUSO") := "N"
				(cTmpImp)->(MsUnlock())
			Else
				MsgAlert("Registro em uso por outro processo.")
			EndIf
		Else
			MsgAlert("Registro já processado.")
		EndIf
	else
		ProcRegua(100)
		dbSelectArea(cTmpImp)
		(cTmpImp)->(dbGoTo(nRecno))

		cQuery += " SELECT R_E_C_N_O_ RECNO "
		cQuery += " FROM " + RetSqlName(cTmpImp)
		cQuery += " WHERE D_E_L_E_T_ = ' ' "
		cQuery += " AND "+cTmpImp+"_TABELA = '"+(cTmpImp)->&(cTabImp + "_TABELA")+"' "
		cQuery += " AND "+cTmpImp+"_FILIAL = '"+ cFilAnt +"' "
		cQuery += " AND "+cTmpImp+"_STATUS IN ('NP','E') "

		cQuery := ChangeQuery(cQuery)

		MPSysOpenQuery( cQuery , "TMP" )

		While !TMP->(Eof())
			//Posiciona com o recno
			dbSelectArea(cTmpImp)
			(cTmpImp)->(dbGoTo(TMP->RECNO))

			If &(cTmpImp+"_EMUSO") <> 'S' .AND. Alltrim(&(cTmpImp+"_STATUS")) $ 'NP#E'
				IncProc()
				//Trava registro
				RecLock(cTmpImp,.F.)
				(cTmpImp)->&(cTmpImp+"_EMUSO") := "S"
				(cTmpImp)->(MsUnlock())

				IF &(cTmpImp+"_OPER") == "I"
					nOpc := 3
				Else
					nOpc := 4
				Endif

				FWJsonDeserialize(&(cTmpImp+"_JSON"), @oParseJSON)

				Do Case
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SF1"
					FWMsgRun(, {|oSay| U_P3GERNF(nOpc,&(cTmpImp+"_CHAVE"),lJob,oSay) }, "Aguarde", "Reprocessando Nota Fiscal...")
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SE2"
					MsgInfo("Este processo é integrado online, não pode ser reprocessado!")
				Case (cTmpImp)->&(cTabImp + "_TABELA") == "SC7"
					FWMsgRun(, {|oSay| U_P3GERSC7(nOpc,&(cTmpImp+"_CHAVE"),lJob,oSay) }, "Aguarde", "Reprocessando Pedido de Compra...")
				EndCase

				//Libera registro
				RecLock(cTmpImp,.F.)
				(cTmpImp)->&(cTmpImp+"_EMUSO") := "N"
				(cTmpImp)->(MsUnlock())
			EndIf
			TMP->(DbSkip())
		EndDo

		TMP->(dbCloseArea())

	Endif

	oModel:DeActivate()
	oModel:Activate()
	oGrid:GoLine(nLinha)
	oView:Refresh(cTabImp+cId)
Return
