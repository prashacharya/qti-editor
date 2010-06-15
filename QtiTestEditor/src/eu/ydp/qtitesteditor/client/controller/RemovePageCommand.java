package eu.ydp.qtitesteditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.constance.Constances;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtitesteditor.client.model.QTITestModelProxy;
import eu.ydp.qtitesteditor.client.view.PageListMediator;

public class RemovePageCommand extends SimpleCommand {
	
	public void execute(INotification notification){
		
		QTITestModelProxy testProxy = (QTITestModelProxy)getFacade().retrieveProxy(QTITestModelProxy.NAME);
		QTIPageModelProxy pagesProxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		PageListMediator mediator = (PageListMediator)getFacade().retrieveMediator(PageListMediator.NAME);
		int ix = mediator.getSelectedIndex();		
		if(ix > -1)
		{
			testProxy.removePage(ix);
			pagesProxy.removePage(ix);
			
			sendNotification(Constances.REMOVE_PAGE_FROM_LIST,ix);
			sendNotification(Constances.SAVE_TEST);
		}
		
	}
}
