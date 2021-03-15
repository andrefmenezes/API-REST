#Include 'Protheus.ch'
#Include "RESTFUL.CH"
#Include "FWMVCDEF.CH"
#INCLUDE "RWMAKE.CH"
#INCLUDE "TBICONN.CH"
#include 'topconn.ch'

User Function P3IMPXML

Return

	WSRestFul IMPXML Description "Importacao de XML - P3Tecnologia"
		WSMethod POST Description "Inclusão do XML - P3Tecnologia" WSSYNTAX "/IMPXML/{id}"

		WsData RECEIVE as String

	End WSRestFul

WSMethod POST WSReceive RECEIVE WSService IMPXML

	Local cJson      := Self:GetContent()   // Pega a string do JSON
	Private oParseJSON := Nil

	RpcClearEnv()
	RpcSetType( 3 )
	RpcSetEnv( "01", "010101" )

	::SetContentType("application/json")

	//FWJsonDeserialize(cJson, @oParseJSON)
	oParseJSON := JsonObject():New()
	oParseJSON:FromJson(cJson)

	IF ValType(oParseJSON) <> "U"
		fGravaXML(oParseJSON)
		::SetResponse('{"Retorno":"200" ,"Mensagem":"Sucesso"}')
	else
		::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
	Endif

	FreeObj(oParseJSON)	

Return .T.


Static Function fGravaXML(oParseJSON)
	Local cTabImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Local nX 		:= 0
	Local nY		:= 0
	Local cJson
	Local cChvDoc   := ""
	Local nLenJson	:= 0
	Local oRest		:= Nil
	Local aHeader	:= {}
	
	IF ValType(oParseJson) == "J"
		nLenJson := Len(oParseJSON)
		For nX := 1 to nLenJson
			IF ValType(oParseJson[nX]) == "J"
				cJson := oParseJson[nX]:ToJson()

				aDados := oParseJson[nX]:GetNames()

				If ValType(aDados) == "A"
					For nY := 1 to Len(aDados)
						oDado := oParseJson[nX][aDados[nY]]
						IF ValType(oDado) == "J"
							aCampos  := oDado:GetNames()
							cCliente := oDado:GetJsonText("A2_CGC")		
							cEmit    := oDado:GetJsonText("F1_FILIAL")	
							cDoc	 := oDado:GetJsonText("F1_DOC")
							dEmissao := StoD(oDado:GetJsonText("F1_EMISSAO"))

							oRest := FwRest():New("http://receitaws.com.br")
							oRest:SetPath("/v1/cnpj/"+cCliente)
							
							aAdd(aHeader,"")

							IF (oRest:Get(aHeader))
								oResult := oRest:GetResult()

								//TODO: Ver cadastro de fornecedor
								/*
								oFornece := JsonObject():New()
								oFornece:FromJson(oResult)
								
								aSA2 := oFornece:GetNames()

								For nZ := 1 to Len(aSA2)
									Do Case


										Case aSA2[nZ] == "nome"
											aAdd(aFornece,{"A2_NOME",oFornece:GetJsonText(aSA2[nZ]),Nil})
											aAdd(aFornece,{"A2_NREDUZ",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "email"
											aAdd(aFornece,{"A2_EMAIL",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "logradouro"
											aAdd(aFornece,{"A2_END",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "bairro"
											aAdd(aFornece,{"A2_BAIRRO",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "cep"
											aAdd(aFornece,{"A2_CEP",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "uf"
											aAdd(aFornece,{"A2_EST",oFornece:GetJsonText(aSA2[nZ]),Nil})
										Case aSA2[nZ] == "municipio"
											aAdd(aFornece,{"A2_MUN",oFornece:GetJsonText(aSA2[nZ]),Nil})
									EndCase
								Next
								*/
							Endif

							IF cDoc <> "null"
								cDoc := StrZero(Val(Right(cDoc,9)),9)
							Else
								::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
								Break
							Endif

							cSerie := oDado:GetJsonText("F1_SERIE")

							If cSerie <> "null"
								cSerie	:= PadR(cSerie,TamSx3("F1_SERIE")[1])
							Else
								cSerie  := Space(3)
							EndIf

							//Posiciona na filial correta
							fSeekFil(cEmit)

							cChvDoc := FwxFilial(cTabImp) + cDoc + cSerie + cCliente

							If !fCheckDup(cChvDoc)
								Reclock(cTabImp,.T.)
								&(cTabImp + "_FILIAL")	:= FwxFilial(cTabImp)
								&(cTabImp + "_STATUS")	:= "NP"//NP,P,E
								&(cTabImp + "_TABELA")	:= "SF1"
								&(cTabImp + "_OPER")	:= "I"
								&(cTabImp + "_CHAVE")	:= fGetChv(cTabImp)
								&(cTabImp + "_JSON")	:= cJson
								&(cTabImp + "_ARQ")	    := cChvDoc//Filial + Documento + Serie + CNPJ
								&(cTabImp + "_DATA")	:= dEmissao
								(cTabImp)->(MsUnlock())
							EndIf

						ElseIf ValType(oDado) == "A"
							//Não faz nada
						Else
							::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
							Break
						Endif
					Next nY

				Else
					::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
					Break
				Endif
			Else
				::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
				Break
			Endif
		Next nX
	Else
		::SetResponse('{"Retorno:":"401","Mensagem":"Falha na estutura do Json"}')
	Endif

Return

Static Function fCheckDup(cChvDoc)
	Local lRet := .F.
	Local cQuery
	Local cTabImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")

	cQuery := " SELECT "+cTabImp+"_CHAVE CHAVE"
	cQuery += " FROM " + RetSqlName(cTabImp)
	cQuery += " WHERE D_E_L_E_T_ = ' ' "
	cQuery += " AND "+cTabImp+"_ARQ = '"+cChvDoc+"' "

	cQuery := ChangeQuery(cQuery)

	MPSysOpenQuery( cQuery , "TMP" )

	If !TMP->(EOF())
		lRet := .T.
	EndIf

Return lRet

Static Function fGetChv(cTabImp)
	Local cRet
	Local cQuery
	Local cTabImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")

	cQuery := " SELECT MAX("+cTabImp+"_CHAVE) CHAVE"
	cQuery += " FROM " + RetSqlName(cTabImp)
	cQuery += " WHERE D_E_L_E_T_ = ' ' "

	cQuery := ChangeQuery(cQuery)

	MPSysOpenQuery( cQuery , "TMP" )

	If !TMP->(EOF()) .AND. !Empty(TMP->CHAVE)
		cRet := StrZero(Val(TMP->CHAVE) + 1,TamSx3(cTabImp+"_CHAVE")[1])
	Else
		cRet := StrZero(1,TamSx3(cTabImp+"_CHAVE")[1])
	EndIf

	TMP->(dbCloseArea())

Return cRet

Static Function fSeekFil(cEmit)

	Local lAchou := .F.

	//logar na filial correta
	dbSelectArea("SM0")
	SM0->(dbSetOrder(1))
	SM0->(dbGoTop())

	While !SM0->(EOF())
		If SM0->M0_CGC == Alltrim(cEmit)
			cEmp := SM0->M0_CODIGO
			cFil := SM0->M0_CODFIL
			RpcClearEnv()
			RpcSetType( 3 )
			RpcSetEnv( cEmp, cFil )
			lAchou := .T.
			Exit
		EndIf
		SM0->(dbSkip())
	EndDo

	If !lAchou
		RpcClearEnv()
			RpcSetType( 3 )
			RpcSetEnv( "01", "010101" )
	Endif
Return
