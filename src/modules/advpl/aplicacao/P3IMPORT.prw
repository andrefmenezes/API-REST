#INCLUDE 'PROTHEUS.CH'
#INCLUDE 'FWMVCDEF.CH'
#INCLUDE 'TBICONN.CH'
#INCLUDE 'TOPCONN.CH'
#INCLUDE 'TOTVS.CH'

User Function P3IMPORT()

	Private cTabImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Private lCheck1 := .T.
	Private lCheck2 := .T.
	Private lCheck3 := .T.
	Private lImpSE2 := SuperGetMv("P3_IMPSE2",,.F.)
	Private lImpSE1 := SuperGetMv("P3_IMPSE1",,.F.)
	Private lImpSC5 := SuperGetMv("P3_IMPSC5",,.F.)
	Private lImpSC7 := SuperGetMv("P3_IMPSC7",,.F.)
	Private lImpSF1 := SuperGetMv("P3_IMPSF1",,.T.)
	

	FWExecView("Importação XML","XP3IMPORT",MODEL_OPERATION_VIEW,,{|| .T.})
	
return .T.
