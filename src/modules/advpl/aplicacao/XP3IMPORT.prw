//Bibliotecas
#Include 'Protheus.ch'
#Include 'FWMVCDef.ch'

//Variáveis Estáticas
Static cTitulo := "Central de Importação"

/*/{Protheus.doc} XP3IMPORT
Exemplo de rotina com multiplas abas em MVC
@author Atilio
@since 25/07/2017
@version 1.0
@return Nil, Função não tem retorno
@example
u_XP3IMPORT()
/*/

User Function XP3IMPORT()
	Local aArea   := GetArea()
	Local oBrowse
	Local cFunBkp := FunName()
	Private cTabImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Private lCheck1 := .T.
	Private lCheck2 := .T.
	Private lCheck3 := .T.
	Private lImpSE2 := SuperGetMv("P3_IMPSE2",,.F.)
	Private lImpSE1 := SuperGetMv("P3_IMPSE1",,.F.)
	Private lImpSC5 := SuperGetMv("P3_IMPSC5",,.F.)
	Private lImpSC7 := SuperGetMv("P3_IMPSC7",,.F.)
	Private lImpSF1 := SuperGetMv("P3_IMPSF1",,.T.)

	oBrowse := FWMBrowse():New()
	oBrowse:SetAlias(cTabImp)
	oBrowse:SetDescription(cTitulo)
	oBrowse:SetMenuDef("XP3IMPORT")
	oBrowse:Activate()

	SetFunName(cFunBkp)
	RestArea(aArea)
Return Nil
/*---------------------------------------------------------------------*
| Func:  MenuDef                                                      |
| Desc:  Criação do menu MVC                                          |
*---------------------------------------------------------------------*/

Static Function MenuDef()
	Local aRot := {}

	//Adicionando opções
	ADD OPTION aRot TITLE 'Visualizar' ACTION 'VIEWDEF.XP3IMPORT' OPERATION MODEL_OPERATION_VIEW ACCESS 0
Return aRot

/*---------------------------------------------------------------------*
| Func:  ModelDef                                                     |
| Desc:  Criação do modelo de dados MVC                               |
*---------------------------------------------------------------------*/

Static Function ModelDef()
	Local oModel     := Nil
	Local oStPai     := FWFormStruct(1, cTabImp)
	Local oStFilho1  := FWFormStruct(1, cTabImp)
	Local oStFilho2  := FWFormStruct(1, cTabImp)
	Local oStFilho3  := FWFormStruct(1, cTabImp)
	Local oStFilho4  := FWFormStruct(1, cTabImp)
	Local oStFilho5  := FWFormStruct(1, cTabImp)
	Local cRegra     := ""

	Local aRelFilho1 := {}
	Local aRelFilho2 := {}
	Local aRelFilho3 := {}
	Local aRelFilho4 := {}
	Local aRelFilho5 := {}

	oStFilho1:AddField( ; 
	AllTrim('') , ;             // [01] C Titulo do campo 
	AllTrim('') , ;             // [02] C ToolTip do campo 
	cTabImp+'_LEGEN' , ;             // [03] C identificador (ID) do Field 
	'C' , ;                     // [04] C Tipo do campo 
	50  , ;                     // [05] N Tamanho do campo 
	0   , ;                     // [06] N Decimal do campo 
	NIL , ;                     // [07] B Code-block de validação do campo 
	NIL , ;                     // [08] B Code-block de validação When do campo 
	NIL , ;                     // [09] A Lista de valores permitido do campo 
	NIL , ;                     // [10] L Indica se o campo tem preenchimento obrigatório 
	{ |oModel| U_XMLLegen(oModel) } , ;           // [11] B Code-block de inicializacao do campo 
	NIL , ;                     // [12] L Indica se trata de um campo chave 
	NIL , ;                     // [13] L Indica se o campo pode receber valor em uma operação de update. 
	.T. )                       // [14] L Indica se o campo é virtual

	oStFilho2:AddField( ; 
	AllTrim('') , ;             // [01] C Titulo do campo 
	AllTrim('') , ;             // [02] C ToolTip do campo 
	cTabImp+'_LEGEN' , ;             // [03] C identificador (ID) do Field 
	'C' , ;                     // [04] C Tipo do campo 
	50  , ;                     // [05] N Tamanho do campo 
	0   , ;                     // [06] N Decimal do campo 
	NIL , ;                     // [07] B Code-block de validação do campo 
	NIL , ;                     // [08] B Code-block de validação When do campo 
	NIL , ;                     // [09] A Lista de valores permitido do campo 
	NIL , ;                     // [10] L Indica se o campo tem preenchimento obrigatório 
	{ |oModel| U_XMLLegen(oModel) } , ;           // [11] B Code-block de inicializacao do campo 
	NIL , ;                     // [12] L Indica se trata de um campo chave 
	NIL , ;                     // [13] L Indica se o campo pode receber valor em uma operação de update. 
	.T. )                       // [14] L Indica se o campo é virtual

	oStFilho3:AddField( ; 
	AllTrim('') , ;             // [01] C Titulo do campo 
	AllTrim('') , ;             // [02] C ToolTip do campo 
	cTabImp+'_LEGEN' , ;             // [03] C identificador (ID) do Field 
	'C' , ;                     // [04] C Tipo do campo 
	50  , ;                     // [05] N Tamanho do campo 
	0   , ;                     // [06] N Decimal do campo 
	NIL , ;                     // [07] B Code-block de validação do campo 
	NIL , ;                     // [08] B Code-block de validação When do campo 
	NIL , ;                     // [09] A Lista de valores permitido do campo 
	NIL , ;                     // [10] L Indica se o campo tem preenchimento obrigatório 
	{ |oModel| U_XMLLegen(oModel) } , ;           // [11] B Code-block de inicializacao do campo 
	NIL , ;                     // [12] L Indica se trata de um campo chave 
	NIL , ;                     // [13] L Indica se o campo pode receber valor em uma operação de update. 
	.T. )                       // [14] L Indica se o campo é virtual

	oStFilho4:AddField( ; 
	AllTrim('') , ;             // [01] C Titulo do campo 
	AllTrim('') , ;             // [02] C ToolTip do campo 
	cTabImp+'_LEGEN' , ;             // [03] C identificador (ID) do Field 
	'C' , ;                     // [04] C Tipo do campo 
	50  , ;                     // [05] N Tamanho do campo 
	0   , ;                     // [06] N Decimal do campo 
	NIL , ;                     // [07] B Code-block de validação do campo 
	NIL , ;                     // [08] B Code-block de validação When do campo 
	NIL , ;                     // [09] A Lista de valores permitido do campo 
	NIL , ;                     // [10] L Indica se o campo tem preenchimento obrigatório 
	{ |oModel| U_XMLLegen(oModel) } , ;           // [11] B Code-block de inicializacao do campo 
	NIL , ;                     // [12] L Indica se trata de um campo chave 
	NIL , ;                     // [13] L Indica se o campo pode receber valor em uma operação de update. 
	.T. )                       // [14] L Indica se o campo é virtual

	oStFilho5:AddField( ; 
	AllTrim('') , ;             // [01] C Titulo do campo 
	AllTrim('') , ;             // [02] C ToolTip do campo 
	cTabImp+'_LEGEN' , ;             // [03] C identificador (ID) do Field 
	'C' , ;                     // [04] C Tipo do campo 
	50  , ;                     // [05] N Tamanho do campo 
	0   , ;                     // [06] N Decimal do campo 
	NIL , ;                     // [07] B Code-block de validação do campo 
	NIL , ;                     // [08] B Code-block de validação When do campo 
	NIL , ;                     // [09] A Lista de valores permitido do campo 
	NIL , ;                     // [10] L Indica se o campo tem preenchimento obrigatório 
	{ |oModel| U_XMLLegen(oModel) } , ;           // [11] B Code-block de inicializacao do campo 
	NIL , ;                     // [12] L Indica se trata de um campo chave 
	NIL , ;                     // [13] L Indica se o campo pode receber valor em uma operação de update. 
	.T. )                       // [14] L Indica se o campo é virtual

	//Criando o modelo
	oModel := MPFormModel():New('MP3IMPORT')
	oModel:AddFields(cTabImp+'_MASTER', /*cOwner*/, oStPai)

	//Criando as grids dos filhos

	IF lImpSE2
		oModel:AddGrid(cTabImp+'_FILHO1', cTabImp+'_MASTER', oStFilho1)
	Endif

	IF lImpSE1
		oModel:AddGrid(cTabImp+'_FILHO2', cTabImp+'_MASTER', oStFilho2)
	Endif

	IF lImpSC5
		oModel:AddGrid(cTabImp+'_FILHO3', cTabImp+'_MASTER', oStFilho3)
	EndIf

	IF lImpSC7
		oModel:AddGrid(cTabImp+'_FILHO4', cTabImp+'_MASTER', oStFilho4)
	EndIf

	IF lImpSF1
		oModel:AddGrid(cTabImp+'_FILHO5', cTabImp+'_MASTER', oStFilho5)
	Endif


	//Criando os relacionamentos dos pais e filhos
	aAdd(aRelFilho1, {cTabImp+'_TABELA', "'SE2'"})
	aAdd(aRelFilho2, {cTabImp+'_TABELA', "'SE1'"})       
	aAdd(aRelFilho3, {cTabImp+'_TABELA', "'SC5'"})       
	aAdd(aRelFilho4, {cTabImp+'_TABELA', "'SC7'"})       
	aAdd(aRelFilho5, {cTabImp+'_TABELA', "'SF1'"}) 

	IF lImpSE2
		//Criando o relacionamento do Filho 1
		oModel:SetRelation(cTabImp+'_FILHO1', aRelFilho1, &(cTabImp+"->(IndexKey(1))"))
		oModel:GetModel(cTabImp+'_FILHO1'):SetUniqueLine({cTabImp+"_FILIAL",cTabImp+"_OPER",cTabImp+"_TABELA",cTabImp+"_CHAVE"})
	Endif

	IF lImpSE1
		//Criando o relacionamento do Filho 2
		oModel:SetRelation(cTabImp+'_FILHO2', aRelFilho2, &(cTabImp+"->(IndexKey(1))"))
		oModel:GetModel(cTabImp+'_FILHO2'):SetUniqueLine({cTabImp+"_FILIAL",cTabImp+"_OPER",cTabImp+"_TABELA",cTabImp+"_CHAVE"})
	Endif


	IF lImpSC5
		//Criando o relacionamento do Filho 3 - Produtos do Armazém 01
		oModel:SetRelation(cTabImp+'_FILHO3', aRelFilho3, &(cTabImp+"->(IndexKey(1))"))
		oModel:GetModel(cTabImp+'_FILHO3'):SetUniqueLine({cTabImp+"_FILIAL",cTabImp+"_OPER",cTabImp+"_TABELA",cTabImp+"_CHAVE"})
	Endif

	IF lImpSC7
		//Criando o relacionamento do Filho 4 - Produtos do Armazém 01
		oModel:SetRelation(cTabImp+'_FILHO4', aRelFilho4, &(cTabImp+"->(IndexKey(1))"))
		oModel:GetModel(cTabImp+'_FILHO4'):SetUniqueLine({cTabImp+"_FILIAL",cTabImp+"_OPER",cTabImp+"_TABELA",cTabImp+"_CHAVE"})
	Endif

	IF lImpSF1
		//Criando o relacionamento do Filho 5 - Produtos do Armazém 01
		oModel:SetRelation(cTabImp+'_FILHO5', aRelFilho5, &(cTabImp+"->(IndexKey(1))"))
		oModel:GetModel(cTabImp+'_FILHO5'):SetUniqueLine({cTabImp+"_FILIAL",cTabImp+"_OPER",cTabImp+"_TABELA",cTabImp+"_CHAVE"})
	Endif
	
	IF RetCodUsr() $ SuperGetMv("P3_XUSRIMP",,"000000,") 
		cRegra := ""
	Else
		cRegra := cTabImp+"_FILIAL = '"+xFilial(cTabImp)+"' "
	Endif

	//Finalizando a criação do Model
	oModel:SetPrimaryKey({})
	oModel:SetDescription("Importação XML")
	oModel:GetModel(cTabImp+'_MASTER'):SetDescription('Importação')
	IF lImpSE2
		oModel:GetModel(cTabImp+'_FILHO1'):SetLoadFilter(,cRegra)
		oModel:GetModel(cTabImp+'_FILHO1'):SetDescription('Contas a Pagar')
	Endif

	IF lImpSE1
		oModel:GetModel(cTabImp+'_FILHO2'):SetLoadFilter(,cRegra)
		oModel:GetModel(cTabImp+'_FILHO2'):SetDescription('Contas a Receber')
	Endif

	IF lImpSC5
		oModel:GetModel(cTabImp+'_FILHO3'):SetLoadFilter(,cRegra)
		oModel:GetModel(cTabImp+'_FILHO3'):SetDescription('Pedido de Venda')
	Endif

	IF lImpSC7
		oModel:GetModel(cTabImp+'_FILHO4'):SetLoadFilter(,cRegra)
		oModel:GetModel(cTabImp+'_FILHO4'):SetDescription('Pedido de Compra')
	Endif

	IF lImpSF1
		oModel:GetModel(cTabImp+'_FILHO5'):SetLoadFilter(,cRegra)
		oModel:GetModel(cTabImp+'_FILHO5'):SetDescription('Pre-nota')
	EndIf
Return oModel

/*---------------------------------------------------------------------*
| Func:  ViewDef                                                      |
| Desc:  Criação da visão MVC                                         |
*---------------------------------------------------------------------*/

Static Function ViewDef()
	Local oView     := Nil
	Local oModel    := FWLoadModel('XP3IMPORT')
	Local oStPai    := FWFormStruct(2, cTabImp )
	Local oStFilho1 := FWFormStruct(2, cTabImp )
	Local oStFilho2 := FWFormStruct(2, cTabImp )
	Local oStFilho3 := FWFormStruct(2, cTabImp )
	Local oStFilho4 := FWFormStruct(2, cTabImp )
	Local oStFilho5 := FWFormStruct(2, cTabImp )
	Local nAtual    := 0

	oStFilho1:AddField( ;                      // Ord. Tipo Desc. 
	cTabImp+'_LEGEN'       , ;     // [01] C   Nome do Campo 
	"00"              , ;     // [02] C   Ordem 
	AllTrim( '' )     , ;     // [03] C   Titulo do campo 
	AllTrim( '' )     , ;     // [04] C   Descricao do campo 
	, ;     // [05] A   Array com Help 
	'C'               , ;     // [06] C   Tipo do campo 
	'@BMP'            , ;     // [07] C   Picture 
	NIL               , ;     // [08] B   Bloco de Picture Var 
	''                , ;     // [09] C   Consulta F3 
	.T.               , ;     // [10] L   Indica se o campo é alteravel 
	NIL               , ;     // [11] C   Pasta do campo 
	NIL               , ;     // [12] C   Agrupamento do campo 
	NIL               , ;     // [13] A   Lista de valores permitido do campo (Combo) 
	NIL               , ;     // [14] N   Tamanho maximo da maior opção do combo 
	NIL               , ;     // [15] C   Inicializador de Browse 
	.T.               , ;     // [16] L   Indica se o campo é virtual 
	NIL               , ;     // [17] C   Picture Variavel 
	NIL               )       // [18] L   Indica pulo de linha após o campo

	oStFilho2:AddField( ;                      // Ord. Tipo Desc. 
	cTabImp+'_LEGEN'       , ;     // [01] C   Nome do Campo 
	"00"              , ;     // [02] C   Ordem 
	AllTrim( '' )     , ;     // [03] C   Titulo do campo 
	AllTrim( '' )     , ;     // [04] C   Descricao do campo 
	, ;     // [05] A   Array com Help 
	'C'               , ;     // [06] C   Tipo do campo 
	'@BMP'            , ;     // [07] C   Picture 
	NIL               , ;     // [08] B   Bloco de Picture Var 
	''                , ;     // [09] C   Consulta F3 
	.T.               , ;     // [10] L   Indica se o campo é alteravel 
	NIL               , ;     // [11] C   Pasta do campo 
	NIL               , ;     // [12] C   Agrupamento do campo 
	NIL               , ;     // [13] A   Lista de valores permitido do campo (Combo) 
	NIL               , ;     // [14] N   Tamanho maximo da maior opção do combo 
	NIL               , ;     // [15] C   Inicializador de Browse 
	.T.               , ;     // [16] L   Indica se o campo é virtual 
	NIL               , ;     // [17] C   Picture Variavel 
	NIL               )       // [18] L   Indica pulo de linha após o campo

	oStFilho3:AddField( ;                      // Ord. Tipo Desc. 
	cTabImp+'_LEGEN'       , ;     // [01] C   Nome do Campo 
	"00"              , ;     // [02] C   Ordem 
	AllTrim( '' )     , ;     // [03] C   Titulo do campo 
	AllTrim( '' )     , ;     // [04] C   Descricao do campo 
	, ;     // [05] A   Array com Help 
	'C'               , ;     // [06] C   Tipo do campo 
	'@BMP'            , ;     // [07] C   Picture 
	NIL               , ;     // [08] B   Bloco de Picture Var 
	''                , ;     // [09] C   Consulta F3 
	.T.               , ;     // [10] L   Indica se o campo é alteravel 
	NIL               , ;     // [11] C   Pasta do campo 
	NIL               , ;     // [12] C   Agrupamento do campo 
	NIL               , ;     // [13] A   Lista de valores permitido do campo (Combo) 
	NIL               , ;     // [14] N   Tamanho maximo da maior opção do combo 
	NIL               , ;     // [15] C   Inicializador de Browse 
	.T.               , ;     // [16] L   Indica se o campo é virtual 
	NIL               , ;     // [17] C   Picture Variavel 
	NIL               )       // [18] L   Indica pulo de linha após o campo

	oStFilho4:AddField( ;                      // Ord. Tipo Desc. 
	cTabImp+'_LEGEN'       , ;     // [01] C   Nome do Campo 
	"00"              , ;     // [02] C   Ordem 
	AllTrim( '' )     , ;     // [03] C   Titulo do campo 
	AllTrim( '' )     , ;     // [04] C   Descricao do campo 
	, ;     // [05] A   Array com Help 
	'C'               , ;     // [06] C   Tipo do campo 
	'@BMP'            , ;     // [07] C   Picture 
	NIL               , ;     // [08] B   Bloco de Picture Var 
	''                , ;     // [09] C   Consulta F3 
	.T.               , ;     // [10] L   Indica se o campo é alteravel 
	NIL               , ;     // [11] C   Pasta do campo 
	NIL               , ;     // [12] C   Agrupamento do campo 
	NIL               , ;     // [13] A   Lista de valores permitido do campo (Combo) 
	NIL               , ;     // [14] N   Tamanho maximo da maior opção do combo 
	NIL               , ;     // [15] C   Inicializador de Browse 
	.T.               , ;     // [16] L   Indica se o campo é virtual 
	NIL               , ;     // [17] C   Picture Variavel 
	NIL               )       // [18] L   Indica pulo de linha após o campo

	oStFilho5:AddField( ;                      // Ord. Tipo Desc. 
	cTabImp+'_LEGEN'       , ;     // [01] C   Nome do Campo 
	"00"              , ;     // [02] C   Ordem 
	AllTrim( '' )     , ;     // [03] C   Titulo do campo 
	AllTrim( '' )     , ;     // [04] C   Descricao do campo 
	, ;     // [05] A   Array com Help 
	'C'               , ;     // [06] C   Tipo do campo 
	'@BMP'            , ;     // [07] C   Picture 
	NIL               , ;     // [08] B   Bloco de Picture Var 
	''                , ;     // [09] C   Consulta F3 
	.T.               , ;     // [10] L   Indica se o campo é alteravel 
	NIL               , ;     // [11] C   Pasta do campo 
	NIL               , ;     // [12] C   Agrupamento do campo 
	NIL               , ;     // [13] A   Lista de valores permitido do campo (Combo) 
	NIL               , ;     // [14] N   Tamanho maximo da maior opção do combo 
	NIL               , ;     // [15] C   Inicializador de Browse 
	.T.               , ;     // [16] L   Indica se o campo é virtual 
	NIL               , ;     // [17] C   Picture Variavel 
	NIL               )       // [18] L   Indica pulo de linha após o campo 


	//Criando a View
	oView := FWFormView():New()
	oView:SetModel(oModel)

	//Adicionando os campos do cabeçalho
	oView:AddField('VIEW_'+cTabImp, oStPai, cTabImp+'_MASTER')

	//Grids dos filhos
	IF lImpSE2
		oView:AddGrid('VIEW_FILHO1', oStFilho1, cTabImp+'_FILHO1')
	Endif

	IF lImpSE1
		oView:AddGrid('VIEW_FILHO2', oStFilho2, cTabImp+'_FILHO2')
	Endif

	IF lImpSC5
		oView:AddGrid('VIEW_FILHO3', oStFilho3, cTabImp+'_FILHO3')
	Endif

	IF lImpSC7
		oView:AddGrid('VIEW_FILHO4', oStFilho4, cTabImp+'_FILHO4')
	EndIf

	IF lImpSF1
		oView:AddGrid('VIEW_FILHO5', oStFilho5, cTabImp+'_FILHO5')
	Endif


	//Setando o dimensionamento de tamanho
	oView:CreateHorizontalBox('SUPERIOR', 1)
	oView:CreateHorizontalBox('MEIO'    , 29)
	oView:CreateHorizontalBox('INFERIOR', 70)

	oView:CreateVerticalBox("GRIDS",80,"INFERIOR")
	oView:CreateVerticalBox("BOTOES",20,"INFERIOR")

	//Criando a folder dos produtos (filhos)S
	oView:CreateFolder('PASTA_FILHOS', 'GRIDS')
	IF lImpSE2
		oView:AddSheet('PASTA_FILHOS', 'ABA_FILHO01', "Contas a Pagar")
	Endif

	IF lImpSE1
		oView:AddSheet('PASTA_FILHOS', 'ABA_FILHO02', "Contas a Receber")
	Endif

	IF lImpSC5
		oView:AddSheet('PASTA_FILHOS', 'ABA_FILHO03', "Pedido de Venda")
	Endif

	IF lImpSC7
		oView:AddSheet('PASTA_FILHOS', 'ABA_FILHO04', "Pedido de Compra")
	Endif

	IF lImpSF1
		oView:AddSheet('PASTA_FILHOS', 'ABA_FILHO05', "Pre-nota")
	Endif

	//Cria as caixas onde serão mostrados os dados dos filhos
	IF lImpSE2
		oView:CreateHorizontalBox('ITENS_FILHO01',100 ,,, 'PASTA_FILHOS', 'ABA_FILHO01' )
	Endif

	IF lImpSE1
		oView:CreateHorizontalBox('ITENS_FILHO02',100 ,,, 'PASTA_FILHOS', 'ABA_FILHO02' )
	Endif

	IF lImpSC5
		oView:CreateHorizontalBox('ITENS_FILHO03',100 ,,, 'PASTA_FILHOS', 'ABA_FILHO03' )
	Endif

	IF lImpSC7
		oView:CreateHorizontalBox('ITENS_FILHO04',100 ,,, 'PASTA_FILHOS', 'ABA_FILHO04' )
	Endif

	IF lImpSF1
		oView:CreateHorizontalBox('ITENS_FILHO05',100 ,,, 'PASTA_FILHOS', 'ABA_FILHO05' )
	Endif

	oView:AddOtherObject("BOTAO", {|oModel| Botao(oModel) })
	oView:AddOtherObject("MEIO" , {|oModel| Cabecalho(oModel) }) 

	//Amarrando a view com as box
	oView:SetOwnerView('VIEW_'+cTabImp,    'SUPERIOR')
	IF lImpSE2
		oView:SetOwnerView('VIEW_FILHO1', 'ITENS_FILHO01')
	Endif

	IF lImpSE1
		oView:SetOwnerView('VIEW_FILHO2', 'ITENS_FILHO02')
	EndIF

	IF lImpSC5
		oView:SetOwnerView('VIEW_FILHO3', 'ITENS_FILHO03')
	Endif

	IF lImpSC7
		oView:SetOwnerView('VIEW_FILHO4', 'ITENS_FILHO04')
	Endif

	IF lImpSF1
		oView:SetOwnerView('VIEW_FILHO5', 'ITENS_FILHO05')
	Endif

	oView:SetOwnerView("BOTAO",'BOTOES')

	oView:AddUserButton("Filtro"           ,"Filtro"           ,{|| Filtro() })
	oView:AddUserButton("Limpar Filtro"    ,"Limpar Filtro"    ,{|| Filtro(.T.)})
	oView:AddUserButton("Pedido x Pre-nota","Pedido x Pre-nota",{|| Amarra()})

Return oView

Static Function Amarra()

	Local cCNPJFor      := ""
	Local cDoc          := ""
	Local cSerie        := ""
	Private _cTmpImp 	:= SuperGetMV("MV_XTBIMP",,"ZZZ")
	Private _oModel		:= FWModelActivate()
    Private _oView		:= FWViewActive()
    Private _aId		:= _oView:GetCurrentSelect()
    Private _cId		:= SubStr(_aId[1],At("_FILHO",_aId[1]),7)
    Private _oGrid 		:= _oModel:GetModel(_cTmpImp+_cId)
    Private _cStatus 	:= _oGrid:GetValue(_cTmpImp+"_STATUS")
    
    IF !"_FILHO5" $ _cId .and. !Alltrim(_cStatus) == "P"
    	MsgInfo("Opção disponível apenas para pré-nota processada.")
    	Return
    Endif
    
    Private _cJSon 	:= _oGrid:GetValue(_cTmpImp+"_JSON")
    Private _oParseJSON 
    
    FWJsonDeserialize(_cJSon, @_oParseJSON)
    
    cCNPJFor := _oParseJSON:SF1:A2_CGC

    dbSelectArea("SA2")
    SA2->(dbSetOrder(3))
    If SA2->(dbSeek(xFilial("SA2") + cCNPJFor))

        cDoc := StrZero(Val(Right(_oParseJSON:SF1:F1_DOC,9)),9)
        If Type("_oParseJSON:SF1:F1_SERIE") <> "U"
            cSerie	:= PadR(_oParseJSON:SF1:F1_SERIE,TamSx3("F1_SERIE")[1])
        EndIf

        dbSelectArea("SF1")
        dbSetOrder(1)
        If dbSeek(xFilial("SF1") + cDoc + cSerie + SA2->(A2_COD+A2_LOJA))
        	U_P3PREXPED()
		Else
			MsgInfo("Nota fiscal não processada.")
        Endif
	Else
		MsgInfo("Fornecedor não cadastrado.")
    Endif

Return

User function XMLLegen(oModel)

	IF Alltrim(&(cTabImp+"->"+cTabImp+"_STATUS")) == 'NP'
		cCor := "BR_AMARELO"
	ElseIf Alltrim(&(cTabImp+"->"+cTabImp+"_STATUS")) == 'P'
		cCor := "BR_VERDE"
	Else
		cCor := "BR_VERMELHO"
	Endif

Return cCor

Static Function Cabecalho(oModel)

	Local oFont := TFont():New('Arial Black',,40,.T.)

	oSay1:= TSay():New(20,200,{||'Central de Importação'},oModel,,oFont,,,,.T.,CLR_BLUE,CLR_WHITE,200,50)

Return Nil

Static Function Filtro(lFiltro)

	Local oModel    := FWMODELACTIVE()
	Local oView     := FWViewActive()
	Local oModelF1 := IIF(lImpSE2,oModel:GetModel(cTabImp+'_FILHO1'),Nil)
	Local oModelF2 := IIF(lImpSE1,oModel:GetModel(cTabImp+'_FILHO2'),Nil)
	Local oModelF3 := IIF(lImpSC5,oModel:GetModel(cTabImp+'_FILHO3'),Nil)
	Local oModelF4 := IIF(lImpSC7,oModel:GetModel(cTabImp+'_FILHO4'),Nil)
	Local oModelF5 := IIF(lImpSF1,oModel:GetModel(cTabImp+'_FILHO5'),Nil)
	Local cRegra   := " "
	Local aPergs   := {}
	Local aRet     := {}
	Local dDataImp := dDataBase
	Local cExpressao := Space(100)
	Local cFilZZZ  := Space(TamSx3(cTabImp+"_FILIAL")[1])

	Default lFiltro := .F.

	If !lFiltro

		AADD(aPergs,{4,;					//3 - Checkbox
		"Não processados",;					//2 - Descrição
		.T.,;								//3 - .T. - inicia marcado; .F. - inicia desmarcado
		"Não processados",;					//4 - Texto Checkbox
		50,;								//5 - Tamanho do radio
		,;								//6 - Validação
		.F.;								//7 - Parametro obrigatorio
		})

		AADD(aPergs,{4,;					//3 - Checkbox
		"Processados",;						//2 - Descrição
		.T.,;								//3 - .T. - inicia marcado; .F. - inicia desmarcado
		"Processados",;						//4 - Texto Checkbox
		50,;								//5 - Tamanho do radio
		,;								//6 - Validação
		.F.;								//7 - Parametro obrigatorio
		})

		AADD(aPergs,{4,;					//3 - Checkbox
		"Erro",;							//2 - Descrição
		.T.,;								//3 - .T. - inicia marcado; .F. - inicia desmarcado
		"Erro",;							//4 - Texto Checkbox
		50,;								//5 - Tamanho do radio
		,;								//6 - Validação
		.F.;								//7 - Parametro obrigatorio
		})

		AADD(aPergs,{1,;					//1 - MsMGet
		"Data importação de",;				//2 - Descrição
		dDataImp,;							//3 - Inicializador do cpo
		"",;								//4 - Picture
		".T.",;								//5 - Validação
		"",;								//6 - Consulta F3
		"",;								//7 - Validação 'When' <- deixar sempre editavel
		50,;								//8 - Tamanho do get
		.T.;								//9 - Parametro obrigatorio
		})
		
		AADD(aPergs,{1,;					//1 - MsMGet
		"Data importação de",;				//2 - Descrição
		dDataImp,;							//3 - Inicializador do cpo
		"",;								//4 - Picture
		".T.",;								//5 - Validação
		"",;								//6 - Consulta F3
		"",;								//7 - Validação 'When' <- deixar sempre editavel
		50,;								//8 - Tamanho do get
		.T.;								//9 - Parametro obrigatorio
		})

		AADD(aPergs,{1,;					//1 - MsMGet
		"Arquivo contém a expressão",;		//2 - Descrição
		cExpressao,;						//3 - Inicializador do cpo
		"",;								//4 - Picture
		".T.",;								//5 - Validação
		"",;								//6 - Consulta F3
		"",;								//7 - Validação 'When' <- deixar sempre editavel
		50,;								//8 - Tamanho do get
		.F.;								//9 - Parametro obrigatorio
		})
		
		AADD(aPergs,{1,;					//1 - MsMGet
		"Filial",;							//2 - Descrição
		cFilZZZ,;							//3 - Inicializador do cpo
		"",;								//4 - Picture
		".T.",;								//5 - Validação
		"XM0",;								//6 - Consulta F3
		"",;								//7 - Validação 'When' <- deixar sempre editavel
		50,;								//8 - Tamanho do get
		.F.;								//9 - Parametro obrigatorio
		})


		IF !ParamBox(aPergs,"Filtro",aRet)
			Return
		Else
			IF !aRet[1] .and. !aRet[2] .and. !aRet[3]
				MsgInfo("Deve-se marcar uma opção de Status.")
				Return
			Endif
		Endif

		cRegra += "("

		If aRet[1]
			cRegra += cTabImp+"_STATUS = 'NP' OR "		
		Endif

		If aRet[2]
			cRegra += cTabImp+"_STATUS = 'P' OR "
		Endif

		If aRet[3]
			cRegra += cTabImp+"_STATUS = 'E' OR "
		Endif

		cRegra := SubStr(cRegra,1,Rat("OR",cRegra)-1)

		cRegra += ")"

		IF !Empty(aRet[4])
			cRegra += " AND " + cTabImp+"_DATA >= '"+DtoS(aRet[4])+"' "
		Endif
		
		IF !Empty(aRet[5])
			cRegra += " AND " + cTabImp+"_DATA <= '"+DtoS(aRet[5])+"' "
		Endif

		IF !Empty(aRet[6])
			cRegra += " AND " + cTabImp+"_ARQ LIKE '%"+Alltrim(aRet[6])+"%' "
		Endif
		
		IF !Empty(aRet[7])
			cRegra += " AND " + cTabImp+"_FILIAL = '"+Alltrim(aRet[7])+"' "
		Endif
	Else
		IF RetCodUsr() $ SuperGetMv("P3_XUSRIMP",,"000000,") 
			cRegra := ""
		Else
			cRegra := cTabImp+"_FILIAL = '"+xFilial(cTabImp)+"' "
		Endif
	Endif


	If oModelF1 <> Nil
		oModelF1:GoLine(1)
	Endif

	If oModelF2 <> Nil
		oModelF2:GoLine(1)
	Endif

	If oModelF3 <> Nil
		oModelF3:GoLine(1)
	Endif

	If oModelF4 <> Nil
		oModelF4:GoLine(1)
	Endif

	If oModelF5 <> Nil
		oModelF5:GoLine(1)
	Endif


	oModel:DeActivate()

	If oModelF1 <> Nil
		oModelF1:SetLoadFilter( , cRegra )
	Endif

	If oModelF2 <> Nil
		oModelF2:SetLoadFilter( , cRegra )
	Endif

	If oModelF3 <> Nil
		oModelF3:SetLoadFilter( , cRegra )
	Endif

	If oModelF4 <> Nil
		oModelF4:SetLoadFilter( , cRegra )
	Endif

	If oModelF5 <> Nil
		oModelF5:SetLoadFilter( , cRegra )
	Endif

	oModel:Activate()

	//Refresh no view
	If oModelF1 <> Nil
		oView:Refresh(cTabImp+'_FILHO1')
	Endif

	If oModelF2 <> Nil
		oView:Refresh(cTabImp+'_FILHO2')
	Endif

	If oModelF3 <> Nil
		oView:Refresh(cTabImp+'_FILHO3')
	Endif

	If oModelF4 <> Nil
		oView:Refresh(cTabImp+'_FILHO4')
	Endif

	If oModelF5 <> Nil
		oView:Refresh(cTabImp+'_FILHO5')
	Endif

Return .T.

Static Function Botao( oModel )  
	Local oBMP
	Local oSay1
	Local oSay2
	Local oSay3

	// Ancoramos os objetos no oModel passado 
	@ 20, 15 Button 'Visualizar Doc'   Size 60, 20 Message 'Visualizar Doc.' Pixel Action U_P3VISDOC() of oModel 

	@ 48, 15 Button 'Erro'             Size 60, 20 Message 'Erro'            Pixel Action u_P3ERROS() of oModel

	@ 76, 15 Button 'Reprocessar'      Size 60, 20 Message 'Reprocessar'     Pixel Action U_P3REPROC(.F.) of oModel

	@ 104, 15 Button 'Reproc. todos'   Size 60, 20 Message 'Reproc. todos'   Pixel Action U_P3REPROC(.T.) of oModel

	@ 132, 15 Button 'Atualizar Tela'  Size 60, 20 Message 'Atualizar tela'  Pixel Action U_P3ATU001() of oModel

	//aFontes := GetResArray("*.png")

	@ 160, 15 BITMAP oBMP FILE "AMARELO.PNG" SIZE 12, 12 OF oModel PIXEL
	@ 162, 30 SAY oSay1 PROMPT "Não processado" SIZE 100, 10 OF oModel PIXEL	
	@ 172, 15 BITMAP oBMP FILE "VERDE.PNG" SIZE 12, 12 OF oModel PIXEL
	@ 175, 30 SAY oSay2 PROMPT "Processado" SIZE 100, 10 OF oModel PIXEL
	@ 185, 15 BITMAP oBMP FILE "VERMELHO.PNG" SIZE 12, 12 OF oModel PIXEL
	@ 188, 30 SAY oSay3 PROMPT "Erro" SIZE 100, 10 OF oModel PIXEL

Return NIL 

User Function P3ATU001()

	Local oModel    := FWMODELACTIVE()
	Local oView     := FWViewActive()
	Local oModelF1 := IIF(lImpSE2,oModel:GetModel(cTabImp+'_FILHO1'),Nil)
	Local oModelF2 := IIF(lImpSE1,oModel:GetModel(cTabImp+'_FILHO2'),Nil)
	Local oModelF3 := IIF(lImpSC5,oModel:GetModel(cTabImp+'_FILHO3'),Nil)
	Local oModelF4 := IIF(lImpSC7,oModel:GetModel(cTabImp+'_FILHO4'),Nil)
	Local oModelF5 := IIF(lImpSF1,oModel:GetModel(cTabImp+'_FILHO5'),Nil)

	oModel:DeActivate()

	oModel:Activate()

	If oModelF1 <> Nil
		oModelF1:GoLine(1)
	Endif
	If oModelF2 <> Nil
		oModelF2:GoLine(1)
	Endif
	If oModelF3 <> Nil
		oModelF3:GoLine(1)
	Endif
	If oModelF4 <> Nil
		oModelF4:GoLine(1)
	Endif
	If oModelF5 <> Nil
		oModelF5:GoLine(1)
	Endif

	//Refresh no view
	If oModelF1 <> Nil
		oView:Refresh(cTabImp+'_FILHO1')
	Endif
	If oModelF2 <> Nil
		oView:Refresh(cTabImp+'_FILHO2')
	Endif
	If oModelF3 <> Nil
		oView:Refresh(cTabImp+'_FILHO3')
	Endif
	If oModelF4 <> Nil
		oView:Refresh(cTabImp+'_FILHO4')
	Endif
	If oModelF5 <> Nil
		oView:Refresh(cTabImp+'_FILHO5')
	Endif

Return
