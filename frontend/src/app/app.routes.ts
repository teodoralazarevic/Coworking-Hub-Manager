import { Routes } from '@angular/router';
import { LoginPublicComponent } from './components/auth/login-public-component/login-public-component';
import { ForgotPassComponent } from './components/auth/forgot-pass-component/forgot-pass-component';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { LoginPrivateComponent } from './components/auth/login-private-component/login-private-component';
import { AdminLayoutComponent } from './components/admin/admin-layout-component/admin-layout-component';
import { PendingRegistrationRequestsComponent } from './components/admin/pending-registration-requests-component/pending-registration-requests-component';
import { ResetPasswordComponent } from './components/auth/reset-password-component/reset-password-component';
import { MemberLayoutComponent } from './components/network-member/member-layout-component/member-layout-component';
import { MemberProfileComponent } from './components/network-member/member-profile-component/member-profile-component';
import { ManagerLayoutComponent } from './components/space-manager/manager-layout-component/manager-layout-component';
import { ManagerProfileComponent } from './components/space-manager/manager-profile-component/manager-profile-component';
import { ManageWorkspaceComponent } from './components/space-manager/manage-workspace-component/manage-workspace-component';
import { UploadWorkspaceComponent } from './components/space-manager/upload-workspace-component/upload-workspace-component';
import { PendingWorkspacesRequestsComponent } from './components/admin/pending-workspaces-requests-component/pending-workspaces-requests-component';
import { AllUsersComponent } from './components/admin/all-users-component/all-users-component';
import { GuestLayoutComponent } from './components/guest/guest-layout-component/guest-layout-component';
import { SearchComponent } from './components/search/search-component/search-component';
import { SpaceDetailsComponent } from './components/search/space-details-component/space-details-component';
import { ReservationsComponent } from './components/space-manager/reservations-component/reservations-component';
import { GuestHomepageComponent } from './components/guest/guest-homepage-component/guest-homepage-component';
import { UpdateWorkspaceComponent } from './components/space-manager/update-workspace-component/update-workspace-component';
import { UserDetailsComponent } from './components/admin/user-details-component/user-details-component';
import { EditUserComponent } from './components/admin/edit-user-component/edit-user-component';
import { WorkspaceDetailsComponent } from './components/admin/workspace-details-component/workspace-details-component';
import { ReportComponent } from './components/space-manager/report-component/report-component';
import { StatisticsComponent } from './components/admin/statistics-component/statistics-component';

export const routes: Routes = [
    {path: "", component:GuestLayoutComponent, children: [
        {path: "", component: GuestHomepageComponent},
        {path: "guest/search", component:SearchComponent},
        {path: "guest/space-details/:workspaceID/:details", component:SpaceDetailsComponent},
        {path:"guest/login", component:LoginPublicComponent},
        {path:"guest/forgot-pass", component:ForgotPassComponent},
        {path:"guest/register", component:RegisterComponent},
        {path:"guest/secret-login", component:LoginPrivateComponent},
        {path: "guest/reset-password/:token", component: ResetPasswordComponent}
    ]},

    {path:"admin", component:AdminLayoutComponent, children: [
        {path:"", component: PendingRegistrationRequestsComponent},
        {path:"registrations-pending", component:PendingRegistrationRequestsComponent},
        {path:"workspaces-pending", component:PendingWorkspacesRequestsComponent},
        {path:"all-users", component:AllUsersComponent},
        {path: "user-details/:username",component:UserDetailsComponent},
        {path: "edit-user/:username", component:EditUserComponent},
        {path: "workspace-details/:workspaceID", component:WorkspaceDetailsComponent},
        {path: "statistics", component: StatisticsComponent}
    ]},

    {path:"member", component:MemberLayoutComponent, children: [
       {path: "", component: GuestHomepageComponent},
       {path:"profile", component:MemberProfileComponent} ,
       {path:"search", component:SearchComponent},
       {path: "space-details/:workspaceID/:details", component: SpaceDetailsComponent}
    ]},
    {path:"manager", component:ManagerLayoutComponent, children: [
        {path: "", component: ReservationsComponent},
        {path: "profile", component:ManagerProfileComponent},
        {path: "manage-workspace", component:ManageWorkspaceComponent},
        {path: "upload-workspace", component:UploadWorkspaceComponent},
        {path: "reservations", component:ReservationsComponent},
        {path: "update-workspace/:workspaceID", component:UpdateWorkspaceComponent},
        {path: "report", component:ReportComponent}
    ]}
];
