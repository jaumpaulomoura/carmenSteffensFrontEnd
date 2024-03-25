import cx_Oracle
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import xlsxwriter 
from openpyxl import Workbook
cx_Oracle.init_oracle_client(lib_dir="/opt/oracle/instantclient_21_11", config_dir="/opt/oracle/instantclient_21_11/network/admin/")
oracle_user = "PRODUCAO"
oracle_password = "a"
oracle_host = "192.168.1.62:1521/chbprd"

app = Flask(__name__)
CORS(app)

def connect_to_oracle():
    return cx_Oracle.connect(oracle_user, oracle_password, oracle_host)


#Back do Pesquisa Ficha


@app.route('/api/queryFicha', methods=['GET'])
def get_query_resultsFichas():
    sql_queryFicha = """SELECT DISTINCT A.PC23EMP08 AS EMPRESA, A.PC23ANO AS ANO, A.PC23FICHA AS FICHA,(select distinct sum(pc23qtdtam) from pc23t1 a1 WHERE A1.PC23EMP08 = 61 AND  A1.PC23ANO=A.PC23ANO and A1.PC23FICHA =  A.PC23FICHA) qtde,
                    TRIM((SELECT CAST(LISTAGG(DISTINCT trim(PC75T1.PC75TAMANH) || '/' || trim(PC75T1.PC75QTDPAR)|| ' ' )as varchar2(200))  FROM PC75T1 PC75T1 WHERE   PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0))GRADE_CORRIDA,
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='25' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "25",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='26' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "26",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='27' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "27",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='28' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "28",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='29' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "29",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='30' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "30",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='31' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "31",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='32' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "32",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='33' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "33",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='34' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "34",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='35' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "35",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='36' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "36",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='37' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "37",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='38' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "38",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='39' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "39",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='40' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "40",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='41' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "41",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='42' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "42",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='43' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "43",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='44' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "44",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='46' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "46",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='PP' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "PP",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='P' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "P",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='M' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "M",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='G' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "G",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='GG' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "GG",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='XG' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "XG",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='XGG' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "XGG",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='XXG' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "XXG",
                    TRIM((SELECT DISTINCT trim(PC75T1.PC75QTDPAR)  FROM PC75T1 PC75T1 WHERE  pc75t1.PC75TAMANH='UN' and PC75T1.PC75CODIGO = a.pc23codgpd AND PC75T1.PC75QTDPAR > 0)) "UN",
                    a.PC23PLANO AS PLANO,a.PC23PLA72 AS PLANO_ORIGINAL, a.PC23MODELO AS MODELO, o.pc10descr as Cor, C.PC13CODCOL AS COD_COL, H.PCAIDESC AS COLECAO, C.PC13CODLAN AS COD_LAN, I.PCBMDESCR AS LANCAMENTO, C.PC13CODCTG AS COD_CATEGORIA, G.PCBJDESCR AS  CATEGORIA, C.PC13CLAITE AS COD_CLASS_ITEM, J.PC16DESCR AS CLAS_ITEM, C.PC13CLASS AS COD_CLASSIFICACAO, M.PC04DESCR  AS CLASSIFICACAO, C.PC13TIPPRO AS TIPO_PRODUTO, a.PC23CODFAB AS FABRICA, K.PC45DESCR AS NOME_FABRICA, C.PC13FORMA AS FORMA, N.PC02DESCR AS DESC_FORMA, C.PC13CODCGE AS COD_GESTOR, O.PCBKDESCR AS DESC_GESTOR,  a.pc23codgpd AS grade,b.PC23ENVIO AS DATA_ENTRADA, b.PC23HORENV AS HORA_ENTRADA, b.PC23USUENT AS USUARIO_ENTRADA, b.PC23DATA AS DATA_SAIDA, b.PC23HORDAT AS HORA_SAIDA, b.PC23USUARI AS USUARIO_SAIDA ,  t1.PC17ANO AnoPedido, t1.pc17pedido Pedido, t2.pc17seq Item_Ped ,t3.PCFYSTATUS StatusPed, t4.PCFWCODIGO as embarque,t5.PC17CODCLI 	AS Codigo_Cliente,t6.FI15NOME 		AS DESC_CLI       FROM PC23T A left JOIN PC23Ta  B ON A.PC23EMP08 = B.PC23EMP08 AND A.PC23ANO = B.PC23ANO AND A.PC23FICHA = B.PC23FICHA AND b.PC23C_CUST = 3900 INNER JOIN PC13T  C ON B.PC23EMP08 = C.PC13EMP08 AND a.PC23MODELO = C.PC13CODIGO AND a.PC23COR = C.PC13COR AND C.PC13ANOPED = 0 INNER JOIN PC10T o ON a.PC23COR = o.pc10codigo INNER JOIN PC23T1 D ON A.PC23EMP08 = D.PC23EMP08 AND A.PC23ANO = D.PC23ANO AND A.PC23FICHA = D.PC23FICHA  LEFT  JOIN PCBJT  G ON C.PC13EMP08 = G.PCBJCODEMP AND C.PC13CODCTG = G.PCBJCODIGO  LEFT  JOIN PCAIT  H ON C.PC13EMP08 = H.PCAICODEMP AND C.PC13CODCOL = H.PCAICODIGO  LEFT  JOIN PCBMT  I ON C.PC13EMP08 = I.PCBMCODEMP AND C.PC13CODLAN = I.PCBMCODIGO  LEFT  JOIN PC16T  J ON C.PC13CLAITE = J.PC16CODIGO  INNER  JOIN PC45T K ON a.PC23CODFAB = K.PC45CODIGO  INNER  JOIN CF01T L ON K.PC45EMPRFA = L.CF01CODEMP  INNER  JOIN PC04T M ON M.PC04CODIGO = C.PC13CLASS  INNER JOIN PC02T N ON C.PC13EMPFOR = N.PC02CODEMP  AND C.PC13FORMA = N.PC02CODIGO INNER JOIN PCBKT O ON C.PC13CODCGE = O.PCBKCODIGO left join pc17tb t1 on a.pc23ano = t1.pc17anofpa and a.pc23ficha= t1.pc17numfpa left JOIN PC17T312 t2 ON t1.pc17pedido = t2.pc17pedido AND t1.pc17emp08 = t2.pc17emp08f AND t1.pc17anofpa = t2.pc17anofic and t1.PC17ANO= t2.pc17ano AND t1.pc17numfpa = t2.pc17ficha left JOIN PCFYTA t3 ON  a.PC23FICHA = t3.PCFYFICHA and a.pc23ano = t3.PCFYANO left JOIN PCFWTA t4 ON t2.PC17SEQ = t4.PCFWSEQ AND t1.PC17PEDIDO = t4.PCFWPEDIDO  and t2.pc17ano = t4.PCFWANOPED left join pc17t t5 on  t1.pc17pedido = t5.pc17pedido AND t1.pc17emp08 = t5.pc17emp08 and t1.PC17ANO= t5.pc17ano LEFT JOIN FI15T t6 ON t5.PC17EMP08   = t6.FI15EMP05 AND t5.PC17FLACLI 	= t6.FI15FLAGCF AND t5.PC17CODCLI = t6.FI15CODCF  WHERE A.PC23EMP08 = 61 AND A.PC23ANO = :ANO AND A.PC23FICHA IN ({ficha})
    """
    
    
    ano = request.args.get('ano')
    ficha = request.args.get('ficha')
    ficha_list = ficha.split(',')

    connection = connect_to_oracle()
    cursor = connection.cursor()

    try:
        # Monta a consulta SQL completa
        full_sql_query = sql_queryFicha.format(ficha=','.join(ficha_list))

        # Cria o dicionário de parâmetros
        params = {'ANO': ano}

        # Executa a consulta SQL com os parâmetros fornecidos
        cursor.execute(full_sql_query, params)

        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        response = jsonify(results)
        response.headers.add("Access-Control-Allow-Origin", "*")  
        return response
        

    finally:
        cursor.close()
        connection.close()


#Back do Pesquisa Modelo


def execute_query(sql_query, params=None):
    connection = connect_to_oracle()
    cursor = connection.cursor()

    if params is not None:
        cursor.execute(sql_query, params)
    else:
        cursor.execute(sql_query)

    columns = [col[0] for col in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    cursor.close()
    connection.close()

    return results

# Criar a API usando Flask

# Definir um endpoint para a rota que retornará os resultados da consulta SQL em JSON
@app.route('/api/query', methods=['GET'])
def get_query_results():
    connection = connect_to_oracle()
    cursor = connection.cursor()
    # Exemplo de consulta SQL. Substitua pela sua consulta desejada.
    sql_queryModel = "SELECT  distinct M.PC23MODELO, trim(B.PC23TAMANH)as tamanho,sum(B.PC23QTDTAM) TOTAL,t.ordem FROM PC23T M INNER JOIN PC23TA A ON M.PC23EMP08 = A.PC23EMP08 AND M.PC23ANO = A.PC23ANO AND M.PC23FICHA = A.PC23FICHA INNER JOIN PC23T1 B ON M.PC23EMP08 = B.PC23EMP08 AND M.PC23ANO = B.PC23ANO AND M.PC23FICHA = B.PC23FICHA LEFT JOIN TAMANHO T ON TRIM(B.PC23TAMANH)=T.TAMANHO      WHERE trim(M.PC23MODELO) = :modelo AND A.PC23DATA >= TO_DATE(:dataInicial, 'DD/MM/YYYY') AND A.PC23DATA <= TO_DATE(:dataFinal, 'DD/MM/YYYY')  AND A.PC23C_CUST = :custo group by M.PC23MODELO,B.PC23TAMANH,t.ordem order by M.PC23MODELO,t.ordem"


    # Recebendo os parâmetros da URL
    modelo = request.args.get('modelo')
    dataInicial = request.args.get('dataInicial')
    dataFinal = request.args.get('dataFinal')
    custo = request.args.get('custo')

    # Verifica se os parâmetros foram fornecidos e monta o dicionário de parâmetros para a consulta SQL
    params = {
        'modelo': modelo,
        'dataInicial': dataInicial,
        'dataFinal': dataFinal,
        'custo': custo
    }

    # Executa a consulta SQL com os parâmetros fornecidos
    results = execute_query(sql_queryModel, params)
    cursor.close()
    connection.close()
    return jsonify(results)

sql_queryModel = "SELECT  distinct M.PC23MODELO, trim(B.PC23TAMANH)as tamanho,sum(B.PC23QTDTAM) TOTAL,t.ordem FROM PC23T M INNER JOIN PC23TA A ON M.PC23EMP08 = A.PC23EMP08 AND M.PC23ANO = A.PC23ANO AND M.PC23FICHA = A.PC23FICHA INNER JOIN PC23T1 B ON M.PC23EMP08 = B.PC23EMP08 AND M.PC23ANO = B.PC23ANO AND M.PC23FICHA = B.PC23FICHA LEFT JOIN TAMANHO T ON TRIM(B.PC23TAMANH)=T.TAMANHO     WHERE trim(M.PC23MODELO) = :modelo AND A.PC23DATA >= TO_DATE(:dataInicial, 'DD/MM/YYYY') AND A.PC23DATA <= TO_DATE(:dataFinal, 'DD/MM/YYYY')  AND A.PC23C_CUST = :custo group by M.PC23MODELO,B.PC23TAMANH, t.ordem order by M.PC23MODELO,t.ordem"

@app.route('/api/export/excel', methods=['GET'])
def export_results_to_excel():
    connection = connect_to_oracle()
    cursor = connection.cursor()
    try:
        # Recebendo os parâmetros da URL
        modelo = request.args.get('modelo')
        dataInicial = request.args.get('dataInicial')
        dataFinal = request.args.get('dataFinal')
        custo = request.args.get('custo')

        # Verifica se os parâmetros foram fornecidos e monta o dicionário de parâmetros para a consulta SQL
        params = {
            'modelo': modelo,
            'dataInicial': dataInicial,
            'dataFinal': dataFinal,
            'custo': custo
        }

        # Executa a consulta SQL com os parâmetros fornecidos
        results = execute_query(sql_queryModel, params)

        # Cria um DataFrame pandas com os resultados
        df = pd.DataFrame(results)

        # Cria um arquivo Excel a partir do DataFrame usando a biblioteca openpyxl
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='openpyxl')
        df.to_excel(writer, sheet_name='Resultado', index=False)

        # Salvar a pasta de trabalho (workbook) no objeto BytesIO usando openpyxl
        workbook = writer.book
        worksheet = writer.sheets['Resultado']

        # Salvar o arquivo usando a planilha worksheet
        workbook.save(output)

        output.seek(0)

        # Enviar o arquivo Excel como resposta
        response = send_file(output, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response.headers["Content-Disposition"] = "attachment; filename=resultado.xlsx"
        cursor.close()
        connection.close()
        return response

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/canEnvNf', methods=['GET'])
def get_query_canEnvNf():
    sql_Nf = """SELECT A.FT07CODEMP as EMPNF, A.FI16MODELO AS MODNF, A.FT07CODIGO AS NF, B.FI15CODCF AS COD_FOR, B.FI15FLAGCF AS TIP_CLI, B.FI15NOME AS NOME_FOR, to_char(A.FT07DTEMI,'DD/MM/YYYY') AS DT_EMI, A.GTFT07ENVIADO AS ENVIADO
                FROM FT07T A 
                 INNER JOIN FI15T B 
                 ON A.FI15EMP05 = B.FI15EMP05 
                 AND A.FI15FLAGCF = B.FI15FLAGCF 
                 AND A.FI15CODCF = B.FI15CODCF 
                 WHERE  A.FT07CODEMP = :empNf
                 AND A.FI16MODELO = :modNf
                 AND A.FT07CODIGO = :nota
    """
    
    
    empNf = request.args.get('empNf')
    modNf = request.args.get('modNf')
    nota = request.args.get('nota')
    
    connection = connect_to_oracle()
    cursor = connection.cursor()

    try:
        
        paramsNf = {'empNf': empNf,
                  'modNf': modNf,
                  'nota': nota}

        # Executa a consulta SQL com os parâmetros fornecidos
        cursor.execute(sql_Nf, paramsNf)

        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        response = jsonify(results)
        response.headers.add("Access-Control-Allow-Origin", "*")  
        return response
        

    finally:
        cursor.close()
        connection.close()
        
@app.route('/api/atuaEnvNf', methods=['GET'])
def get_query_atuaEnvNf():       
    empNf = request.args.get('empNf')
    modNf = request.args.get('modNf')
    nota = request.args.get('nota')
    connection = connect_to_oracle()
    cursor = connection.cursor()    
    try:        
        query_delete = f"""DELETE FROM FT78T
                            WHERE FT78CODEMP = '{empNf}' 
                                AND FT78MODELO = '{modNf}' 
                                AND FT78CODIGO = {nota} 
                                AND FT78CODSIS = 'GESTOR'"""
        cursor.execute(query_delete)

        query_update = f"""UPDATE FT07T
                                SET GTFT07ENVIADO = 'N'
                                WHERE FT07CODEMP = '{empNf}' 
                                    AND FI16MODELO = '{modNf}' 
                                    AND FT07CODIGO = {nota}"""
        cursor.execute(query_update)
        connection.commit()

        # Retorne uma resposta de sucesso para o front-end
        response_data = {"message": "Consultas executadas com sucesso"}
        return jsonify(response_data), 200

    except cx_Oracle.Error as error:
        # Em caso de erro, retorne uma resposta de erro
        error_message = str(error)
        return jsonify({"error": error_message}), 500

    finally:
        # Sempre feche o cursor e a conexão
        cursor.close()
        connection.close()





def inserir_dados(lista_de_dados):
    conexao = connect_to_oracle()
    cursor = conexao.cursor()

    for data in lista_de_dados:
        try:
            cursor.execute(''' INSERT INTO TB_NF_BOLSA (CODFOR, DTEMI, NF, STATUSNF) VALUES (:codFor,to_date(:dataEmissao,'dd/mm/yyyy'), :nf, :status)
            ''', {
                 'codFor': int(data['codFor']),
                'dataEmissao': data['dataEmissao'],  # Se o banco aceita data como string, não precisa converter
                'nf': int(data['nf']),
                'status': data.get('status', None)  # Verifique se 'status' existe no dicionário
            })

        except cx_Oracle.Error as error:
            print("Erro durante a inserção:", error)

    conexao.commit()
    conexao.close()
       
@app.route('/api/inseriNfBolsa', methods=['POST'])
def inseriNfBolsa():
    dataNfBolsa = request.get_json()
    print(dataNfBolsa)
    inserir_dados(dataNfBolsa)
    return 'JSON recebido com sucesso'


@app.route('/api/queryEnt', methods=['GET'])
def get_query_resultsEnt():
    connection = connect_to_oracle()
    cursor = connection.cursor()
    # Exemplo de consulta SQL. Substitua pela sua consulta desejada.
    sql_queryModel = "SELECT  distinct M.PC23MODELO, trim(B.PC23TAMANH)as tamanho,sum(B.PC23QTDTAM) TOTAL,t.ordem FROM PC23T M INNER JOIN PC23TA A ON M.PC23EMP08 = A.PC23EMP08 AND M.PC23ANO = A.PC23ANO AND M.PC23FICHA = A.PC23FICHA INNER JOIN PC23T1 B ON M.PC23EMP08 = B.PC23EMP08 AND M.PC23ANO = B.PC23ANO AND M.PC23FICHA = B.PC23FICHA LEFT JOIN TAMANHO T ON TRIM(B.PC23TAMANH)=T.TAMANHO      WHERE trim(M.PC23MODELO) = :modelo AND A.PC23ENVIO >= TO_DATE(:dataInicial, 'DD/MM/YYYY') AND A.PC23ENVIO <= TO_DATE(:dataFinal, 'DD/MM/YYYY')  AND A.PC23C_CUST = :custo group by M.PC23MODELO,B.PC23TAMANH,t.ordem order by M.PC23MODELO,t.ordem"


    # Recebendo os parâmetros da URL
    modelo = request.args.get('modelo')
    dataInicial = request.args.get('dataInicial')
    dataFinal = request.args.get('dataFinal')
    custo = request.args.get('custo')

    # Verifica se os parâmetros foram fornecidos e monta o dicionário de parâmetros para a consulta SQL
    params = {
        'modelo': modelo,
        'dataInicial': dataInicial,
        'dataFinal': dataFinal,
        'custo': custo
    }

    # Executa a consulta SQL com os parâmetros fornecidos
    results = execute_query(sql_queryModel, params)
    cursor.close()
    connection.close()
    return jsonify(results)

sql_queryModel = "SELECT  distinct M.PC23MODELO, trim(B.PC23TAMANH)as tamanho,sum(B.PC23QTDTAM) TOTAL,t.ordem FROM PC23T M INNER JOIN PC23TA A ON M.PC23EMP08 = A.PC23EMP08 AND M.PC23ANO = A.PC23ANO AND M.PC23FICHA = A.PC23FICHA INNER JOIN PC23T1 B ON M.PC23EMP08 = B.PC23EMP08 AND M.PC23ANO = B.PC23ANO AND M.PC23FICHA = B.PC23FICHA LEFT JOIN TAMANHO T ON TRIM(B.PC23TAMANH)=T.TAMANHO     WHERE trim(M.PC23MODELO) = :modelo AND A.PC23ENVIO >= TO_DATE(:dataInicial, 'DD/MM/YYYY') AND A.PC23ENVIO <= TO_DATE(:dataFinal, 'DD/MM/YYYY')  AND A.PC23C_CUST = :custo group by M.PC23MODELO,B.PC23TAMANH, t.ordem order by M.PC23MODELO,t.ordem"

@app.route('/api/exportEnt/excel', methods=['GET'])
def export_results_to_excelEnt():
    connection = connect_to_oracle()
    cursor = connection.cursor()
    try:
        # Recebendo os parâmetros da URL
        modelo = request.args.get('modelo')
        dataInicial = request.args.get('dataInicial')
        dataFinal = request.args.get('dataFinal')
        custo = request.args.get('custo')

        # Verifica se os parâmetros foram fornecidos e monta o dicionário de parâmetros para a consulta SQL
        params = {
            'modelo': modelo,
            'dataInicial': dataInicial,
            'dataFinal': dataFinal,
            'custo': custo
        }

        # Executa a consulta SQL com os parâmetros fornecidos
        results = execute_query(sql_queryModel, params)

        # Cria um DataFrame pandas com os resultados
        df = pd.DataFrame(results)

        # Cria um arquivo Excel a partir do DataFrame usando a biblioteca openpyxl
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='openpyxl')
        df.to_excel(writer, sheet_name='Resultado', index=False)

        # Salvar a pasta de trabalho (workbook) no objeto BytesIO usando openpyxl
        workbook = writer.book
        worksheet = writer.sheets['Resultado']

        # Salvar o arquivo usando a planilha worksheet
        workbook.save(output)

        output.seek(0)

        # Enviar o arquivo Excel como resposta
        response = send_file(output, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response.headers["Content-Disposition"] = "attachment; filename=resultado.xlsx"
        cursor.close()
        connection.close()
        return response

    except Exception as e:
        return jsonify({'error': str(e)})



if __name__ == '__main__':
    #   app.run( debug=True, port=5000)
      app.run(host='0.0.0.0', debug=True, port=5000)
