#include "protheus.ch"

User Function P3ERROS()

	//Local oError := ErrorBlock({|e| MsgAlert("Mensagem de Erro: " +chr(10)+ e:Description)})
	
	Private cTabErr 	:= SuperGetMV("MV_XTBERR",,"ZZY")
	Private cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Private aStru		:= {}
	Private aCpoBro		:= {}
	Private oModel		:= FWModelActivate()
    Private oView		:= FWViewActive()
    Private aId			:= oView:GetCurrentSelect()
    Private cId			:= SubStr(aId[1],At("_FILHO",aId[1]),7)
    
    IF !"_FILHO" $ cID
    	MsgInfo("Se posicione no registro desejado!")
    	Return
    Endif
    
    Private oGrid 	:= oModel:GetModel(cTmpImp+cId)
	Private cChave    := oGrid:GetValue(cTmpImp+"_CHAVE")
	Private cDoc      := SubStr(oGrid:GetValue(cTmpImp+"_ARQ"),Len(FwxFilial(cTmpImp)),9)
	Private cAlias    := GetNextAlias()
	Private oTmpTable := FWTemporaryTable():New(cAlias)
	Private oDlg

	//Cria um arquivo de Apoio
	AADD(aStru,{"CODERRO","C", 3    ,0})
	AADD(aStru,{"ERRO"   ,"C", 40   ,0})
	AADD(aStru,{"DETALHE","C", 100  ,0})

	oTmpTable:SetFields(aStru)

	oTmpTable:Create()

	//Alimenta o arquivo de apoio com os registros do cadastro de clientes (SA1)
	DbSelectArea(cTabErr)
	(cTabErr)->(dbSetOrder(1))
	If (cTabErr)->(dbSeek(cChave))

		While  (cTabErr)->(!Eof()) .and. (cTabErr)->&(cTabErr+"_CHAVE") == cChave
			DbSelectArea(cAlias)

			RecLock(cAlias,.T.)
			(cAlias)->CODERRO   :=  (cTabErr)->&(cTabErr+"_CODERR")
			(cAlias)->ERRO      :=  (cTabErr)->&(cTabErr+"_ERRO")
			(cAlias)->DETALHE   :=  (cTabErr)->&(cTabErr+"_DETALH")
			(cAlias)->(MsUnlock())

			(cTabErr)->(DbSkip())
		Enddo

		//Define quais colunas (campos da TTRB) serao exibidas na MsSelect
		aCpoBro	:= {;
		{ "CODERRO"		,, "Codigo"         ,"@!"},;
		{ "ERRO"		,, "Erro"           ,"@!"},;
		{ "DETALHE"		,, "Detalhe"        ,"@!"}}

		//Cria uma Dialog
		DEFINE MSDIALOG oDlg TITLE "Erros Doc: " + cDoc  From 9,0 To 315,800 PIXEL
		DbSelectArea(cAlias)
		(cAlias)->(DbGotop())
		//Cria a MsSelect
		oMsSel := MsSelect():New(cAlias,"","",aCpoBro,,,{17,1,150,400},,,,,)
		//Exibe a Dialog
		ACTIVATE MSDIALOG oDlg CENTERED
	Else
		MsgAlert("Nenhum erro encontrado para o registro selecionado.")
	EndIf

	//Fecha a Area e elimina os arquivos de apoio criados em disco.
	oTmpTable:Delete()
	
	//ErrorBlock(oError)
Return