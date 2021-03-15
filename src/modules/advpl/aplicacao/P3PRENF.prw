#Include 'Protheus.ch'
#Include "RESTFUL.CH"
#Include "FWMVCDEF.CH"
#INCLUDE "RWMAKE.CH"
#INCLUDE "TBICONN.CH"
#include 'topconn.ch'

User Function P3PRENF(cEmpP3,cFilP3)
	
	RpcClearEnv()
	RpcSetType(3)
	RpcSetEnv(cEmpP3,cFilP3,,,,)
	
	U_XP3PRENF()

Return

User Function XP3PRENF()
	Local cQuery 	:= ""
	Local cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Local lJob 		:= .T.
	Private oParseJSON

	cQuery += " SELECT R_E_C_N_O_ RECNO "
	cQuery += " FROM " + RetSqlName(cTmpImp)
	cQuery += " WHERE D_E_L_E_T_ = ' ' "
	cQuery += " AND "+cTmpImp+"_TABELA = 'SF1' "
	cQuery += " AND "+cTmpImp+"_FILIAL = '"+ cFilAnt +"' "
	cQuery += " AND "+cTmpImp+"_STATUS IN ('NP','E') "

	cQuery := ChangeQuery(cQuery)

	MPSysOpenQuery( cQuery , "TMP" )

	While !TMP->(Eof())
		//Posiciona com o recno
		dbSelectArea(cTmpImp)
		(cTmpImp)->(dbGoTo(TMP->RECNO))

		If &(cTmpImp+"_EMUSO") <> 'S' .AND. Alltrim(&(cTmpImp+"_STATUS")) $ 'NP#E'
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

			U_P3GERNF(nOpc,&(cTmpImp+"_CHAVE"),lJob)

			//Libera registro
			RecLock(cTmpImp,.F.)
			(cTmpImp)->&(cTmpImp+"_EMUSO") := "N"
			(cTmpImp)->(MsUnlock())
		EndIf
		TMP->(DbSkip())
	EndDo

	TMP->(dbCloseArea())

Return


User Function P3GERNF(nOpc,cChave,lJob)
	Local cCNPJEmp	:= ""
	Local cCNPJFor	:= ""
	Local cDoc 		:= ""
	Local cSerie 	:= Space(3)
	Local cFornece	:= ""
	Local cEspecie  := ""
	Local cLoja 	:= ""
	Local cProd		:= ""
	Local cCodPrdF	:= ""
	Local aCabec	:= {}
	Local aItens	:= {}
	Local aLinha	:= {}
	Local aErro		:= {}
	Local aCorrecao := {}
	Local lAchou 	:= .F.
	Local cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Local aEmpresas := FwLoadSM0()
	Local nY

	Private lMsErroAuto 	:= .F.
	Private lMsHelpAuto    	:= .T.
	Private lAutoErrNoFile 	:= .T.

	cCNPJEmp := oParseJSON:SF1:F1_FILIAL

	nPosEmp := aScan(aEmpresas,{|x| Alltrim(x[18]) == cCNPJEmp })

	IF nPosEmp > 0
		cEmpAnt := aEmpresas[nPosEmp][1]//Seto as variaveis de ambiente
		cFilAnt := aEmpresas[nPosEmp][2]

	//	RpcSetType( 3 )
	//	RpcSetEnv( cEmpAnt, cFilAnt )

		lAchou := .T.
	Endif

	If lAchou
		//Retira erro
		AADD(aCorrecao,{'005'})

		cCNPJFor := oParseJSON:SF1:A2_CGC

		dbSelectArea("SA2")
		SA2->(dbSetOrder(3))
		If SA2->(dbSeek(xFilial("SA2") + cCNPJFor))
			//Retira erro
			AADD(aCorrecao,{'004'})

			cDoc		:= StrZero(Val(Right(oParseJSON:SF1:F1_DOC,9)),9)
			If Type("oParseJSON:SF1:F1_SERIE") <> "U"
				cSerie	:= PadR(oParseJSON:SF1:F1_SERIE,TamSx3("F1_SERIE")[1])
			EndIf

			cEspecie := oParseJSON:SF1:F1_ESPECIE
			
			IF ExistBlock("P3ALTESP")
				cEspecie := ExecBlock("P3ALTESP")
			Endif

			cFornece	:= SA2->A2_COD
			cLoja 		:= SA2->A2_LOJA

			dbSelectArea("SF1")
			SF1->(dbSetOrder(1))

			IF !SF1->(dbSeek(xFilial("SF1") + cDoc + cSerie + cFornece + cLoja))
				//Retira erro
				AADD(aCorrecao,{'003'})

				aAdd(aCabec,{'F1_DOC'		,cDoc									,NIL})
				aAdd(aCabec,{'F1_SERIE'		,cSerie									,NIL})
				aAdd(aCabec,{'F1_FORNECE'	,PadR(cFornece,TamSx3("F1_FORNECE")[1])	,NIL})
				aAdd(aCabec,{'F1_LOJA'		,cLoja									,NIL})
				aAdd(aCabec,{'F1_ESPECIE'	,cEspecie								,NIL})
				aAdd(aCabec,{'F1_TIPO'		,oParseJSON:SF1:F1_TIPO					,NIL})
				aAdd(aCabec,{"F1_EMISSAO"	,SToD(oParseJSON:SF1:F1_EMISSAO)		,NIL})
				aAdd(aCabec,{'F1_FORMUL'	,'N'									,NIL})

				For nY := 1 to Len(oParseJSON:SD1)

					dbSelectArea("SA5")
					SA5->(dbSetOrder(14))

					cCodPrdF := oParseJSON:SD1[nY]:D1_COD
					cDesPrdF := oParseJSON:SD1[nY]:D1_DESC

					If Empty(cCodPrdF)
						SA5->(dbSeek(xFilial("SA5")+cFornece+cLoja))
					Else
						SA5->(dbSeek(xFilial("SA5")+cFornece+cLoja+cCodPrdF))
					EndIf

					If SA5->(Found())
						//Retira erro
						AADD(aCorrecao,{'001'})

						cProd := SA5->A5_PRODUTO
					Else
						If Empty(cCodPrdF)
							aAdd(aErro, {'001','Sem amarração Produtos X Fornecedor',"Fornecedor:"+cFornece+" - Loja:"+cLoja+" - Produto: "+cCodPrdF + " " + Alltrim(cDesPrdF)})
						Else
							aAdd(aErro, {'001','Sem amarração Produtos X Fornecedor',"Fornecedor:"+cFornece+" - Loja:"+cLoja+" - Produto: "+cCodPrdF + " " + Alltrim(cDesPrdF)})
						EndIf
					EndIf

					SA5->(DbCloseArea())

					aAdd(aItens,{'D1_COD'	,cProd,NIL})
					aAdd(aItens,{'D1_QUANT'	,Val(oParseJSON:SD1[nY]:D1_QUANT)	,Nil})
					aAdd(aItens,{'D1_VUNIT'	,Val(oParseJSON:SD1[nY]:D1_VUNIT)	,Nil})
					aAdd(aItens,{'D1_TOTAL'	,Val(oParseJSON:SD1[nY]:D1_TOTAL)	,Nil})

					aAdd(aLinha,aItens)
					aItens := {}
				Next nY

				MSExecAuto({|x,y,z| MATA140(x,y,z)}, aCabec, aLinha, nOpc)

				If lMsErroAuto
					aAutoErro := GETAUTOGRLOG()
					cErro     := TrataErro(aAutoErro)   // Pegar o motivo do erro do execauto
					aAdd(aErro, {'002','Erro de Rotina Automática',cErro})
				else
					//Troca status
					RecLock(cTmpImp,.F.)
					(cTmpImp)->&(cTmpImp+"_STATUS") := "P"
					(cTmpImp)->(MsUnlock())

					//Retira erro
					AADD(aCorrecao,{'002'})
				EndIf

				aCabec := {}
				aLinha := {}
			Else
				aAdd(aErro, {'003','Nota Fiscal já cadastrada',"Chave: " + cDoc + cSerie + cFornece + cLoja})
			EndIf
		Else
			aAdd(aErro, {'004','Fornecedor não cadastrado',"CNPJ: " + cCNPJFor})
		EndIf
	Else
		aAdd(aErro, {'005','CNPJ não encontrado entre as filiais',"CNPJ: " + cCNPJEmp})
	EndIf

	If Len(aCorrecao) > 0
		GravaErro(aCorrecao,cChave,.F.)
	EndIf

	If Len(aErro) > 0
		//Troca status
		RecLock(cTmpImp,.F.)
		(cTmpImp)->&(cTmpImp+"_STATUS") := "E"
		(cTmpImp)->(MsUnlock())

		//Grava erro
		GravaErro(aErro,cChave,.T.)
	EndIf

Return

Static Function GravaErro(aMen,cChave,lGrava)
	Local cTabErr 	:= SuperGetMV("MV_XTBERR",,"ZZY")
	Local cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Local nX
	Local lLimpa    := .T. //Variável para controlar a limpeza dos erros

	dbSelectArea(cTabErr)

	For nX := 1 to Len(aMen)
		(cTabErr)->(dbSetOrder(1))
		If lGrava
			If (cTabErr)->(dbSeek(cChave)) .and. lLimpa//Chave
				lLimpa := .F.
				While cChave == (cTabErr)->(&(cTabErr+"_CHAVE") + &(cTabErr+"_CODERR"))
					Reclock(cTabErr,.F.)
					(cTabErr)->(DbDelete())
					(cTabErr)->(MsUnlock())
					(cTabErr)->(DbSkip())
				EndDo
				
				(cTabErr)->(DbCloseArea())
			Endif

			Reclock(cTabErr,.T.)
			&(cTabErr + "_FILIAL")	:= FwxFilial(cTmpImp)
			&(cTabErr + "_TABELA")	:= "SF1"
			&(cTabErr + "_CHAVE")	:= cChave
			&(cTabErr + "_CODERR")	:= aMen[nX][1]
			&(cTabErr + "_ERRO")	:= aMen[nX][2]
			&(cTabErr + "_DETALH")	:= aMen[nX][3]
			(cTabErr)->(MsUnlock())
		Else
			If (cTabErr)->(dbSeek(cChave + aMen[nX][1])) //Chave + CodErr            
				While cChave + aMen[nX][1] == (cTabErr)->(&(cTabErr+"_CHAVE") + &(cTabErr+"_CODERR"))
					Reclock(cTabErr,.F.)
					(cTabErr)->(DbDelete())
					(cTabErr)->(MsUnlock())
					(cTabErr)->(DbSkip())
				EndDo
			EndIf
		EndIf
	Next nX

Return

Static Function TrataErro(pAutoErro)
	Local cRet     := ""
	Local cTexto   := ""
	Local nX       := 0
	Local nY       := 0
	Local aAcentos := {"ÁA","áa","ÉE","ée","ÓO","óo","ÍI","íi","ÇC","çc","ÃA","ãa","ÕO","õo","ÊE","êe","ÀA","àa"}

	For nX := 1 To Len(pAutoErro)
		cTexto := pAutoErro[nX]

		For nY := 1 To Len(aAcentos)
			cTexto := StrTran(cTexto,Substr(aAcentos[nY],1,1),Substr(aAcentos[nY],2,1))
		Next

		cRet += StrTran(cTexto,Chr(13) + Chr(10)," ")
	Next
Return cRet
