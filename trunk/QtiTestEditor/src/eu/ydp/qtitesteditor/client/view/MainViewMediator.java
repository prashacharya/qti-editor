package eu.ydp.qtitesteditor.client.view;

import org.puremvc.java.multicore.interfaces.IMediator;
import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;


import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.RootPanel;

import eu.ydp.qtiPageEditor.client.constance.Constances;
import eu.ydp.qtiPageEditor.client.view.PageEditorViewMediator;
import eu.ydp.qtiPageEditor.client.view.component.AlertWindow;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;
import eu.ydp.qtitesteditor.client.view.component.MainView;
import eu.ydp.qtitesteditor.client.view.component.PageListBarView;
import eu.ydp.qtitesteditor.client.view.component.PageListView;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;

public class MainViewMediator extends Mediator implements IMediator {
	
	public static final String NAME = "MainViewMediator";
	
	private String _cellId;
	
	public MainViewMediator(String id){
		super(NAME, new MainView());
		_cellId = id;
		
	}
	
	public void onRegister()
	{
		MainView mv = (MainView)getViewComponent();		
		RootPanel.get(_cellId).add(mv);
		
		getFacade().registerMediator(new PageListBarMediator());
		getFacade().registerMediator(new PageListMediator());
		getFacade().registerMediator(new PageEditorViewMediator());
		
		addView( retrieveView(PageListBarMediator.NAME));
		addView( retrieveView(PageListMediator.NAME));
		addView( retrieveView(PageEditorViewMediator.NAME));
				
	}
	
	private void addView(Composite view)
	{
		MainView mv = (MainView)getViewComponent();
		if(view instanceof PageListBarView)
			mv.addPageListBar((PageListBarView)view);
		else if(view instanceof PageListView)
			mv.addPageList((PageListView)view);
		else if(view instanceof PageEditorView)
			mv.addTinyEditor((PageEditorView)view);
			
	}
	
	private Composite retrieveView(String mediatorName){
		return (Composite)getFacade().retrieveMediator(mediatorName).getViewComponent(); 
	}
	
	private void showErrorPopup(IApiError error){
		AlertWindow alert = new AlertWindow();
		alert.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
		alert.center();
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Constances.LOAD_TEST_ERROR, 
				Constances.LOAD_PAGE_ERROR, 
				Constances.SAVE_TEST_ERROR,
				Constances.SAVE_PAGE_ERROR};
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String n = notification.getName();
		
		if(n == Constances.LOAD_TEST_ERROR ||
				n == Constances.LOAD_PAGE_ERROR ||
				n == Constances.SAVE_PAGE_ERROR ||
				n == Constances.SAVE_TEST_ERROR)
			showErrorPopup((IApiError)notification.getBody());
		
		
	}
}
