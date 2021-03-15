#include "protheus.ch"

User Function P3VISDOC()
    Local oModel 	:= FWModelActivate()
    Local cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
    Local oView     := FWViewActive()
    Private aId			:= oView:GetCurrentSelect()
    Private cId			:= SubStr(aId[1],At("_FILHO",aId[1]),7)
    
    IF !"_FILHO" $ cId
    	MsgInfo("Se posicione no registro desejado!")
    	Return
    Endif
    
    Private oGrid 	:= oModel:GetModel(cTmpImp+cId)
    Private cJSon 	:= oGrid:GetValue(cTmpImp+"_JSON")
    Private nLinha    := oGrid:GetLine()
    Private nRecno    := oGrid:GetDataId(nLinha)
    Private oParseJSON

    dbSelectArea(cTmpImp)
    (cTmpImp)->(dbGoTo(nRecno))

    If Alltrim(&(cTmpImp+"_STATUS")) == "P"
        If &(cTmpImp+"_EMUSO") <> "S"

            FWJsonDeserialize(cJSon, @oParseJSON)
            
            IF Alltrim(&(cTmpImp+"_TABELA")) == "SF1"

            	FWMsgRun(, {|oSay| VisuPreNF(oSay) }, "Aguarde", "Exibindo Documento...")
            	
            ElseIf Alltrim(&(cTmpImp+"_TABELA")) == "SE2"
            
            	FWMsgRun(, {|oSay| VisuSE2(oSay) }, "Aguarde", "Exibindo Documento...")
            
            ElseIf Alltrim(&(cTmpImp+"_TABELA")) == "SC7"
            
            	FWMsgRun(, {|oSay| VisuSC7(oSay) }, "Aguarde", "Exibindo Documento...")
            
            Endif

        Else
            MsgAlert("Registro em uso por outro processo.")
        EndIf
    Else
        MsgAlert("Registro não processado.")
    EndIf

Return

Static Function VisuPreNF()
    Local cCNPJFor
    Local aCabec := {}
    Local aLinha := {}
    Local cSerie := Space(3)

    Private lMsErroAuto := .F.

    cCNPJFor := oParseJSON:SF1:A2_CGC

    dbSelectArea("SA2")
    SA2->(dbSetOrder(3))
    If SA2->(dbSeek(xFilial("SA2") + cCNPJFor))

        cDoc := StrZero(Val(Right(oParseJSON:SF1:F1_DOC,9)),9)

        If Type("oParseJSON:SF1:F1_SERIE") <> "U"
            cSerie	:= PadR(oParseJSON:SF1:F1_SERIE,TamSx3("F1_SERIE")[1])
        EndIf

        dbSelectArea("SF1")
        dbSetOrder(1)
        If dbSeek(xFilial("SF1") + cDoc + cSerie + SA2->(A2_COD+A2_LOJA))

            aAdd(aCabec,{'F1_DOC'		,SF1->F1_DOC	    ,NIL})
            aAdd(aCabec,{'F1_SERIE'		,SF1->F1_SERIE	    ,NIL})
            aAdd(aCabec,{'F1_FORNECE'	,SF1->F1_FORNECE	,NIL})
            aAdd(aCabec,{'F1_LOJA'		,SF1->F1_LOJA	    ,NIL})

            MSExecAuto({|x,y,z,a,b| MATA140(x,y,z,a,b)}, aCabec, aLinha, 2, .T., 2)

            If lMsErroAuto
                MostraErro()
            EndIf
        Else
            MsgAlert("Documento não encontrado.")
        EndIf
    Else
        MsgAlert("Fornecedor não cadastrado.")
    EndIf

Return

Static Function VisuSE2()

	Local aRegSE2    := {}                  // Array para ExecAuto do FINA050
	Private lMsErroAuto    := .F.
	 
 	cEmpAnt := SubStr(oParseJSON:EMPRESA,1,2)
	cFilAnt := oParseJSON:EMPRESA

	DbSelectArea("SA2")
	SA2->(DbSetOrder(3))
	SA2->(MsSeek(xFilial("SA2") + oParseJSON:CGCCPF))
		 
	aRegSE2 := {}

	aAdd(aRegSE2, {"E2_FILIAL" , xFilial("SE2")          , Nil})
	aAdd(aRegSE2, {"E2_PREFIXO", oParseJSON:E2_PREFIXO   , Nil})
	aAdd(aRegSE2, {"E2_NUM"    , oParseJSON:E2_NUM       , Nil})
	aAdd(aRegSE2, {"E2_PARCELA", oParseJSON:E2_PARCELA   , Nil})
	aAdd(aRegSE2, {"E2_TIPO"   , oParseJSON:E2_TIPO      , Nil})
	aAdd(aRegSE2, {"E2_FORNECE", SA2->A2_COD             , Nil})
	aAdd(aRegSE2, {"E2_LOJA"   , SA2->A2_LOJA            , Nil})
	
	lMsErroAuto := .F.

	MSExecAuto({|x,y| FINA050(x,y)}, aRegSE2, 2)

	If lMsErroAuto
		MsgInfo("Não foi possível visualizar o documento")
	Endif

Return

Static Function VisuSc7()

    Local aEmpresas := FwLoadSM0()
    Local cCNPJEMP := StrTran(StrTran(StrTran(Alltrim(oParseJSON:CNPJEMP),".",""),"-",""),"/","")
    Local aCabec := {}
    Local aLinha := {}
    Local aItens := {}
    Local nX

    nPosEmp := aScan(aEmpresas,{|x,y| Alltrim(x[18]) == cCNPJEMP})

    cEmpAnt := aEmpresas[nPosEmp][3]
    cFilAnt := aEmpresas[nPosEmp][2]

    DbSelectArea("SC7")
    SC7->(dbOrderNickName("XPUBLI"))
    IF SC7->(MsSeek(xFilial("SC7") + Alltrim(oParseJSON:C7_NUM) ))

        cCNPJFOR := StrTran(StrTran(StrTran(Alltrim(oParseJSON:CNPJFOR),".",""),"-",""),"/","")

		dbSelectArea("SA2")
		SA2->(dbSetOrder(3))
		SA2->(MsSeek(xFilial("SA2")+ cCNPJFOR))
		cFornece := SA2->A2_COD
		cLoja    := SA2->A2_LOJA
		
        aadd(aCabec,{"C7_NUM"     ,SC7->C7_NUM })	
        aadd(aCabec,{"C7_EMISSAO" ,CtoD(oParseJSON:C7_EMISSAO)})
		aadd(aCabec,{"C7_FORNECE" ,cFornece})
		aadd(aCabec,{"C7_LOJA"    ,cLoja   })
		aadd(aCabec,{"C7_COND"    ,oParseJSON:C7_COND   })
		aadd(aCabec,{"C7_CONTATO" ,oParseJSON:C7_CONTATO})
		aadd(aCabec,{"C7_FILENT"  ,cFilAnt})

        For nX := 1 To Len(oParseJSON:ITENS)

        	aLinha := {}
			aadd(aLinha,{"C7_PRODUTO" ,oParseJson:ITENS[nX]:C7_PRODUTO,Nil})
			aadd(aLinha,{"C7_QUANT"   ,Val(oParseJson:ITENS[nX]:C7_QUANT)  ,Nil})
			aadd(aLinha,{"C7_PRECO"   ,Val(oParseJson:ITENS[nX]:C7_PRECO)  ,Nil})
			aadd(aLinha,{"C7_TOTAL"   ,Val(oParseJson:ITENS[nX]:C7_TOTAL)  ,Nil})
			aadd(aLinha,{"C7_TES"     ,oParseJson:ITENS[nX]:C7_TES         ,Nil})
			aadd(aLinha,{"C7_VALDESC" ,Val(oParseJson:ITENS[nX]:C7_VALDESC),Nil})
			aadd(aLinha,{"C7_XPBULI"  ,oParseJSON:C7_NUM                   ,Nil})
			aadd(aItens,aLinha)
        Next nX

        lMsErroAuto := .F.		

        //MATA120(1,aCabec,aItens,2,,)
        DbSelectArea("SC7")
        MSExecAuto({|v,x,y,z| MATA120(v,x,y,z)},1,aCabec,aItens,2)

        If lMsErroAuto
            MsgInfo("Não foi possível visualizar o documento")
        Endif
    else
        MsgInfo("Pedido não encontrado")
    Endif


Return