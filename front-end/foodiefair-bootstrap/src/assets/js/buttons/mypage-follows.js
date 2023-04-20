const followersTab = document.getElementById('followers-tab');
const followingsTab = document.getElementById('followings-tab');

followersTab.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('follows-modal'));
    modal.show();
    const followersTabPane = document.getElementById('followers-tab-pane');
    const tab = new bootstrap.Tab(followersTabPane);
    tab.show();
});

followingsTab.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('follows-modal'));
    modal.show();
    const followingsTabPane = document.getElementById('followings-tab-pane');
    const tab = new bootstrap.Tab(followingsTabPane);
    tab.show();
});
