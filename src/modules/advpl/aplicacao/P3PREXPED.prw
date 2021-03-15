#Include 'Protheus.ch'

User Function P3PREXPED()
    Local oDlg
    Local oTGet1
    Local oSay1
    Local cTGet1 	:= Space(150)
    Local lOk 		:= .F.
    Local lConsLoja := (mv_par02 == 1)
    Local cRestNFe	:= SuperGetMV("MV_RESTNFE")
    Local cAlias    := GetNextAlias()
    Local oTmpTable := FWTemporaryTable():New(cAlias)
    Local aStru     := {}
    Local aCpoBro   := {}
    Local oDlg

    Private lInverte    := .F.
    Private cMark       := GetMark()
    Private oMark

    cQuery := " SELECT C7_FORNECE,C7_LOJA,C7_NUM,C7_EMISSAO FROM "
    cQuery += RetSqlName("SC7") + " SC7 "
    cQuery += " WHERE C7_FILENT = '"+xFilEnt(xFilial("SC7"))+"' AND "
    cQuery += " C7_FORNECE = '"+SF1->F1_FORNECE+"' AND "
    If ( lConsLoja )
        cQuery += " C7_LOJA = '"+SF1->F1_LOJA+"' AND "
    Endif
    cQuery += " (C7_QUANT-C7_QUJE-C7_QTDACLA)>0 AND "
    cQuery += " C7_RESIDUO=' ' AND "
    cQuery += " C7_TPOP<>'P' AND "

    If cRestNFe == "S"
        cQuery += " C7_CONAPRO <> 'B' AND C7_CONAPRO <> 'R' AND "
    EndIf

    cQuery += " D_E_L_E_T_ = ' ' "
    cQuery += " ORDER BY " + SqlOrder(SC7->(IndexKey()))

    cQuery := ChangeQuery(cQuery)

    MPSysOpenQuery( cQuery , "TMP" )

    //Cria um arquivo de Apoio
    AADD(aStru,{"OK"     ,"C"	,2		,0		})
    AADD(aStru,{"LOJA"   ,"C"	,2		,0		})
    AADD(aStru,{"PEDIDO" ,"C"	,6		,0		})
    AADD(aStru,{"EMISSAO","D"	,8		,0		})

    oTmpTable:SetFields(aStru)
    oTmpTable:AddIndex("01", {"PEDIDO"} )
    oTmpTable:Create()

    //Alimenta o arquivo de apoio com os registros
    DbSelectArea(cAlias)
    While  TMP->(!Eof())
        (cAlias)->(dbSetOrder(1))
        If !(cAlias)->(dbSeek(TMP->C7_NUM))
            RecLock(cAlias,.T.)
            (cAlias)->LOJA      := TMP->C7_LOJA
            (cAlias)->PEDIDO    := TMP->C7_NUM
            (cAlias)->EMISSAO   := SToD(TMP->C7_EMISSAO)
            MsunLock()
        EndIf
        TMP->(DbSkip())
    Enddo

    (cAlias)->(dbGoTop())

    TPM->(dbCloseArea())

    //Define quais colunas (campos da TTRB) serao exibidas na MsSelect
    aCpoBro	:= {;
        { "OK"			,, ""              ,"@!"},;
        { "LOJA"		,, "Loja"          ,"@!"},;
        { "PEDIDO"		,, "Pedido"        ,"@!"},;
        { "EMISSAO"		,, "Emissão"       ,"@D"}}

    //Cria uma Dialog
    DEFINE MSDIALOG oDlg TITLE "Pedido de Compra" From 9,0 To 315,500 PIXEL

    //Cria a MsSelect
    oMark := MsSelect():New(cAlias,"OK","",aCpoBro,@lInverte,@cMark,{35,1,150,250},,,,,)
    oMark:bMark := {| | Disp(cAlias)}

    //Exibe a Dialog
    ACTIVATE MSDIALOG oDlg CENTERED ON INIT EnchoiceBar(oDlg,{|| lOk := .T. , oDlg:End()},{|| oDlg:End()})

    If lOk
    	Begin Transaction
        FWMsgRun(, {|| fPed(cAlias) }, "Aguarde", "Amarrando Pedidos...")
        End Transaction
    EndIf

    //Fecha a Area e elimina os arquivos de apoio criados em disco.
    oTmpTable:Delete()
Return

//Funcao executada ao Marcar/Desmarcar um registro.   
Static Function Disp(cAlias)

    RecLock(cAlias,.F.)
    If Marked("OK")
        (cAlias)->OK := cMark
    Else
        (cAlias)->OK := ""
    Endif
    (cAlias)->(MSUNLOCK())
    oMark:oBrowse:Refresh()

Return()

Static Function fPed(cAlias)
    Local aSaldo    := {}
    Local aNewPrd   := {}
    Local aLinha    := {}
    Local aPrdAmar  := {}
    Local cPed      := ""
    Local cQuery    := ""
    Local cRestNFe	:= SuperGetMV("MV_RESTNFE")
    Local aCampos   := FWSX3Util():GetAllFields("SD1",.F.)
    Local lAmarra   := .F.
    Local nY 
    Local nX

    (cAlias)->(dbGoTop())
    While !(cAlias)->(EoF())
        If !Empty((cAlias)->OK)
            cPed += (cAlias)->PEDIDO + "/"
        EndIf
        (cAlias)->(dbSkip())
    EndDo
    //Retirar ultima barra
    cPed := SubStr(cPed,1,Len(cPed)-1)
    
    lRet := .T.

    While lRet
        //Reinicia variaveis
        aNewPrd := {}
        aSaldo := {}
        lAmarra := .F.
        
        //Query com pedidos marcados
        cQuery := " SELECT C7_PRODUTO,C7_NUM,C7_ITEM,C7_QUANT-C7_QUJE-C7_QTDACLA SALDO, C7_OBS FROM "
        cQuery += RetSqlName("SC7") + " SC7 "
        cQuery += " WHERE (C7_QUANT-C7_QUJE-C7_QTDACLA)>0 AND "
        cQuery += " C7_RESIDUO=' ' AND "
        cQuery += " C7_TPOP<>'P' AND "
        cQuery += " C7_NUM IN " + FormatIn(cPed,"/") + " AND "
        If cRestNFe == "S"
            cQuery += " C7_CONAPRO <> 'B' AND C7_CONAPRO <> 'R' AND "
        EndIf
        cQuery += " D_E_L_E_T_ = ' ' "
        cQuery += " ORDER BY " + SqlOrder(SC7->(IndexKey()))

        cQuery := ChangeQuery(cQuery)

        MPSysOpenQuery( cQuery , "TMP" )

        While !TMP->(EOF())
            AADD(aSaldo,{TMP->C7_PRODUTO,TMP->SALDO,TMP->C7_NUM,TMP->C7_ITEM,TMP->C7_OBS})
            TMP->(dbSkip())
        EndDo

        If Len(aSaldo) <= 0
            //sai do loop
            lRet := .F.
        EndIf

        TMP->(dbCloseArea())
        
        IF lRet
	        //Preenche pedido nos itens da nota
	        dbSelectArea("SD1")
	        SD1->(dbSetOrder(1))
	        For nX := 1 to 3
	            If SD1->(dbSeek(SF1->(F1_FILIAL + F1_DOC + F1_SERIE + F1_FORNECE + F1_LOJA)))
	                While !SD1->(EoF()) .AND. ;
	                        SD1->D1_FILIAL  == SF1->F1_FILIAL   .AND.;
	                        SD1->D1_DOC     == SF1->F1_DOC      .AND.;
	                        SD1->D1_SERIE   == SF1->F1_SERIE    .AND.;
	                        SD1->D1_FORNECE == SF1->F1_FORNECE  .AND.;
	                        SD1->D1_LOJA    == SF1->F1_LOJA
	
	                    If Empty(SD1->D1_PEDIDO)
	                        lAmarra := .T.
	                        //Se for primeira volta, prioriza quantidades iguais
	                        If nX == 1
	                            //Procura mesmo produto com saldo igual
	                            nPos := aScan(aSaldo,{|x| Alltrim(x[1]) == AllTrim(SD1->D1_COD) .AND. x[2] == SD1->D1_QUANT})
	                            If !Empty(nPos)
	                                aSaldo[nPos][2] := 0
	                                //Atualiza campos da Nota
	                                Reclock("SD1",.F.)
	                                SD1->D1_PEDIDO := aSaldo[nPos][3]
                                    SD1->D1_ITEMPC := aSaldo[nPos][4]
                                    SD1->D1_XOBS   := aSaldo[nPos][5]
	                                SD1->(MsUnlock())
	                            EndIf
	                        ElseIf nX == 2
	                            //Procura mesmo produto com saldo maior
	                            nPos := aScan(aSaldo,{|x| Alltrim(x[1]) == AllTrim(SD1->D1_COD) .AND. x[2] > SD1->D1_QUANT})
	                            If !Empty(nPos)
	                                aSaldo[nPos][2] := aSaldo[nPos][2] - SD1->D1_QUANT
	                                //Atualiza campos da Nota
	                                Reclock("SD1",.F.)
	                                SD1->D1_PEDIDO := aSaldo[nPos][3]
                                    SD1->D1_ITEMPC := aSaldo[nPos][4]
                                    SD1->D1_XOBS   := aSaldo[nPos][5]
	                                SD1->(MsUnlock())
	                            EndIf
	                        ElseIf nX == 3
	                            //Procura mesmo produto com saldo menor
	                            nPos := aScan(aSaldo,{|x| Alltrim(x[1]) == AllTrim(SD1->D1_COD) .AND. x[2] < SD1->D1_QUANT .AND. x[2] > 0})
	                            If !Empty(nPos)
	                                nDifNew := SD1->D1_QUANT - aSaldo[nPos][2]
	                                //Grava array para incluir novo item na nota
	                                For nY := 1 to Len(aCampos)
	                                    If aCampos[nY] == "D1_QUANT"
	                                        AADD(aLinha,{aCampos[nY],nDifNew})
	                                    ElseIf aCampos[nY] == "D1_ITEM"
	                                        AADD(aLinha,{aCampos[nY], StrZero(Val(fItemSD1()) + (Len(aNewPrd)+1),4) })
	                                    ElseIf aCampos[nY] == "D1_TOTAL"
	                                        AADD(aLinha,{aCampos[nY],nDifNew * SD1->D1_VUNIT})
	                                    Else
	                                        AADD(aLinha,{aCampos[nY],FieldGet(FieldPos(aCampos[nY]))})
	                                    EndIf
	                                Next nY
	                                AADD(aNewPrd,aLinha)
	                                aLinha := {}
	                                //Atualiza campos da Nota
	                                Reclock("SD1",.F.)
	                                SD1->D1_QUANT  := aSaldo[nPos][2]
	                                SD1->D1_TOTAL  := aSaldo[nPos][2] * SD1->D1_VUNIT
	                                SD1->D1_PEDIDO := aSaldo[nPos][3]
                                    SD1->D1_ITEMPC := aSaldo[nPos][4]
                                    SD1->D1_XOBS   := aSaldo[nPos][5]
	                                SD1->(MsUnlock())
	                                //Atualiza saldo array
	                                aSaldo[nPos][2] := 0
	                            EndIf
	                        EndIf
	                    EndIf
	
	                    SD1->(dbSkip())
	                EndDo
	            EndIf
	        Next nX
	
	        If !Empty(aNewPrd)
	            For nX := 1 to Len(aNewPrd)
	            	
	                RecLock("SD1",.T.)
	                For nY := 1 to Len(aNewPrd[nX])
	                	If !Alltrim(aNewPrd[nX][nY][1]) == "D1_PEDIDO" .AND. !Alltrim(aNewPrd[nX][nY][1]) ==  "D1_ITEMPC"
	                		&(aNewPrd[nX][nY][1]) := aNewPrd[nX][nY][2]
	                    EndIf
	                Next nY
	                SD1->(MsUnlock())
	            Next nX
	        EndIf
	
	        //Atualiza quantidade a classificar (C7_QTDACLA)
	        If lAmarra
	            dbSelectArea("SD1")
	            SD1->(dbSetOrder(1))
	            If SD1->(dbSeek(SF1->(F1_FILIAL + F1_DOC + F1_SERIE + F1_FORNECE + F1_LOJA)))
	                While !SD1->(EoF()) .AND. ;
	                        SD1->D1_FILIAL  == SF1->F1_FILIAL   .AND.;
	                        SD1->D1_DOC     == SF1->F1_DOC      .AND.;
	                        SD1->D1_SERIE   == SF1->F1_SERIE    .AND.;
	                        SD1->D1_FORNECE == SF1->F1_FORNECE  .AND.;
	                        SD1->D1_LOJA    == SF1->F1_LOJA
	                    //verifica se CHAVE da SD1 foi consumido na SC7 para não consumir novamente
	                    nPos := aScan(aPrdAmar,{|x| x == SD1->(D1_FILIAL+D1_DOC+D1_SERIE+D1_FORNECE+D1_LOJA+D1_COD+D1_ITEM)})
	                    If Empty(nPos)
	                        dbSelectArea("SC7")
	                        SC7->(dbSetOrder(1))
	                        If SC7->(dbSeek(SD1->(D1_FILIAL + D1_PEDIDO + D1_ITEMPC)))
	                            //consome da SC7 quantidade amarrada na SD1
	                            Reclock("SC7",.F.)
	                            SC7->C7_QTDACLA := SC7->C7_QTDACLA + SD1->D1_QUANT
	                            SC7->(MsUnlock())
	                            //registra CHAVE já consumida para verificar depois
	                            AADD(aPrdAmar,SD1->(D1_FILIAL+D1_DOC+D1_SERIE+D1_FORNECE+D1_LOJA+D1_COD+D1_ITEM))
	                        Else
	                        	lRet := .F.
	                        EndIf
	                    EndIf
	                    SD1->(dbSkip())
	                EndDo
	            EndIf
	        Else
	            //Já amarrou todos os itens da SD1, então sai do loop
	            lRet := .F.
	        EndIf
        Endif

    EndDo

Return

Static Function fItemSD1()
    Local cItem := "001"
    Local cQuery := ""

    cQuery := " SELECT MAX(D1_ITEM) ITEM
    cQuery += " FROM " + RetSqlName("SD1")
    cQuery += " WHERE D_E_L_E_T_ = ' ' "
    cQuery += " AND D1_DOC = '"+ SD1->D1_DOC +"' "
    cQuery += " AND D1_SERIE = '"+ SD1->D1_SERIE +"' "
    cQuery += " AND D1_FORNECE = '"+ SD1->D1_FORNECE +"' "
    cQuery += " AND D1_LOJA = '"+ SD1->D1_LOJA +"' "

    cQuery := ChangeQuery(cQuery)

    MPSysOpenQuery( cQuery , "MAXSD1" )

    If !Empty(MAXSD1->ITEM)
        cItem := MAXSD1->ITEM
    EndIf

    MAXSD1->(dbCloseArea())

Return cItem
