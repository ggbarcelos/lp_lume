# Revisão do conteúdo — Lume

Revisão realizada em 9 de outubro de 2026.

## Organização aplicada

- **Hero e faixa:** proposta de valor e resumo dos benefícios.
- **Demonstração:** único passo a passo completo, com as duas telas sincronizadas. O link “Como funciona” leva a essa seção.
- **Dados do RS:** contexto público, com ano das ocorrências e data da descrição da rede. Não são resultados ou cobertura do Lume.
- **Aplicativos:** recursos e papel de cada interface, sem repetir toda a demonstração.
- **Segurança do SOS:** continuidade do pedido, notificações e acompanhamento.
- **Implantação:** cobertura, equipes, permissões e protocolo municipal.
- **FAQ:** dúvidas específicas de uso e limites do serviço.

O passo a passo textual com um segundo mapa foi consolidado na demonstração. O comparativo de fluxos foi substituído pela seção de segurança. A disponibilidade municipal e o 190 permanecem em pontos relevantes de decisão.

## Precisão das afirmações

### Cancelamento

A rota `AlertsController.CancelAlert` no projeto Lume retorna erro quando a vítima tenta cancelar o chamado confirmado. Existe um método `CancelAlertAsync` no serviço, mas ele não é executado por essa rota. A LP descreve a regra efetiva da API, sem afirmar que a ocorrência nunca possa ser encerrada por sua operação responsável.

### Notificações

O código local envia novos SOS por FCM a policiais elegíveis em serviço no Android e possui um handler de recebimento em segundo plano no Lume Force. A LP informa que o app não precisa permanecer aberto na tela, com conexão e notificações habilitadas. Encerramento forçado e restrições do aparelho podem impedir a entrega.

Não foi identificada confirmação equivalente de push com o aplicativo fechado para a vítima no Lume. Os eventos de aceite, posição e status da vítima estão presentes via SignalR. A promessa de push sem tela aberta foi, por isso, atribuída ao Lume Force.

### Continuidade e resposta

O serviço persiste o SOS antes de disparar notificações. Registro, envio de notificação e aceite policial são estados distintos. Não há evidência suficiente nesta revisão para garantir recebimento ou deslocamento em todas as situações, nem para anunciar um mecanismo de escalonamento automático quando nenhuma equipe assume.

A seção de segurança descreve continuidade e acompanhamento do chamado. A página não anuncia criptografia ponta a ponta.

## Fontes

- Projeto local: `Lume.Api/Controllers/AlertsController.cs`, `Lume.Infrastructure/Services/AlertService.cs` e `SignalRNotificationService.cs`; handler Android do Lume Force.
- SSP/RS, publicação de 2 de julho de 2026: https://ssp.rs.gov.br/governo-do-estado-firma-parceria-com-empresa-de-tecnologia-para-oferecer-transporte-gratuito-a-mulheres-vitimas-de-violencia
- Limites de recebimento: https://firebase.google.com/docs/cloud-messaging/flutter/receive-messages

## Escopo

Revisão editorial e inspeção do código de origem. Sem alteração dos aplicativos ou da API. Sem teste de entrega de notificações em aparelhos ou validação visual da página no navegador.
