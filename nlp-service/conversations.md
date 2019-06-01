# INTENT Welcome conversation
* GA: Cześć! Tu aplikacja {appName}
* GA: Czy chcesz poznać nasze menu czy zamówić pizzę?
* --- USER CHOICE; CONTEXT: init-decision  ---

# INTENT Showing restaurant's menu 
* GA: {richContent z menu}
* GA: Oto nasze menu.
* GA: Wybierz pizzę z listy, bądź powiedz jej numer

# USER CHOICE: order pizza
* if TRUE -> want_order_event, else -> end_of_conv_event

# EVENT want_order_event
* GA: Podaj numery i rozmiary pizzy jakie chcesz zamówić
* USER: 5, 11, 9
* GA: Twoje zamówienie to: {list of pizzas}. Do zapłaty będzie: {sum}
* --- GA saves order in conversation cache ---
* -> ask_for_address_event

# EVENT ask_for_address_event
* GA: DeliveryAddress(reason: 'Aby dowieźć twoje zamówienie')

# INTENT address_provided
* if userDecision == ACCEPTED:
    * GA: Super. Twoje zamówienie zostało wysłane do restauracji.
    * GA: Numer twojego zamówienia to: {orderNumber}
    * --- GA saves orderNumber in persistent memory ---
    * -> end_of_conv_event
* else:
    * GA: Niestety bez twojego adresu nie mogę wysłać twojego zamówienia do restauracji.
    * -> end_of_conv_event 