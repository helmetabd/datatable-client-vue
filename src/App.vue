<script setup lang="ts">
const dataTables = [
  {
    id: 1,
    name: 'Kellie Whitfield',
    phone: '(723) 523-9492',
    email: 'ac.tellus@yahoo.com'
  },
  {
    id: 2,
    name: 'Eve Fernandez',
    phone: '(458) 923-1615',
    email: 'ipsum.cursus.vestibulum@google.com'
  },
  {
    id: 3,
    name: 'Erasmus Gray',
    phone: '1-222-594-7477',
    email: 'nec.enim.nunc@outlook.couk'
  },
  {
    id: 4,
    name: 'Kim Middleton',
    phone: '(124) 321-3762',
    email: 'vestibulum.mauris@google.edu'
  },
  {
    id: 5,
    name: 'Colton Mejia',
    phone: '1-861-476-2861',
    email: 'urna@outlook.com'
  },
  {
    id: 6,
    name: 'Haley Torres',
    phone: '(276) 667-7887',
    email: 'amet.ante@hotmail.ca'
  },
  {
    id: 7,
    name: 'Adria Burris',
    phone: '1-857-824-8496',
    email: 'metus.aliquam@hotmail.net'
  },
  {
    id: 8,
    name: 'Larissa Allen',
    phone: '(863) 861-6210',
    email: 'arcu.iaculis.enim@outlook.edu'
  },
  {
    id: 9,
    name: 'Claire Rivers',
    phone: '1-644-275-5578',
    email: 'feugiat@icloud.org'
  },
  {
    id: 10,
    name: 'Jelani Guerrero',
    phone: '(445) 564-5202',
    email: 'urna.nullam.lobortis@icloud.com'
  },
  {
    id: 11,
    name: 'Lucian Joyner',
    phone: '1-133-566-9551',
    email: 'vestibulum.nec@protonmail.edu'
  },
  {
    id: 12,
    name: 'Cameran Mccall',
    phone: '(465) 265-5363',
    email: 'mollis.integer@yahoo.edu'
  },
  {
    id: 13,
    name: 'Aimee Simon',
    phone: '1-743-483-5628',
    email: 'est.nunc.laoreet@google.org'
  },
  {
    id: 14,
    name: 'Kyle Barlow',
    phone: '1-570-152-4863',
    email: 'nibh@hotmail.ca'
  },
  {
    id: 15,
    name: 'Kaseem Clemons',
    phone: '(759) 518-2485',
    email: 'eget.varius.ultrices@aol.couk'
  },
  {
    id: 16,
    name: 'Ria Barrett',
    phone: '1-425-829-2568',
    email: 'id@icloud.org'
  },
  {
    id: 17,
    name: 'Kenyon Norton',
    phone: '(442) 201-6082',
    email: 'a.ultricies@google.org'
  },
  {
    id: 18,
    name: 'Dara Navarro',
    phone: '1-393-742-5785',
    email: 'ipsum.leo@icloud.couk'
  },
  {
    id: 19,
    name: 'Ferris Fletcher',
    phone: '1-280-976-7258',
    email: 'habitant@icloud.couk'
  },
  {
    id: 20,
    name: 'Drew Hensley',
    phone: '(260) 525-0133',
    email: 'aliquet@aol.edu'
  }
]
const columns = [
  {
    label: 'ID',
    name: 'id',
    targetCollapsed: true,
    sortable: true,
    filterable: false
  },
  {
    name: 'name',
    label: 'Staff',
    sortable: true,
    filterable: true,
    class: 'fw-bolder',
    headerClass: 'text-warning'
  },
  {
    name: 'phone',
    label: 'Phone',
    sortable: true,
    filterable: true,
    class: 'fw-bolder'
  },
  {
    name: 'email',
    label: 'Email',
    sortable: true,
    filterable: true,
    class: 'fw-bolder'
  },
  {
    name: 'custom',
    label: 'Custom',
    sortable: true,
    filterable: true,
    customizeRow: true
  }
]
</script>

<template>
  <header>
    <div class="wrapper">
      <h3>Datatable Client</h3>
      <datatable-client
        :dataTable="dataTables"
        :column="columns"
        :buttons="{ copy: true, excel: false, print: true }"
        collapsed
      >
        <template #column-custom="{ item }">
          <span class="badge bg-success-subtle text-success">{{ item.name }}</span>
        </template>
        <template #childCollapsed="{ item }">
          <ul class="dtr-details">
            <li>
              <span class="dtr-title">Name</span>
              <span class="dtr-data">{{ item.name }}</span>
            </li>
            <li>
              <span class="dtr-title">Value</span>
              <span class="dtr-data">{{ item.phone }}</span>
            </li>
            <li>
              <span class="dtr-title">Message</span>
              <span class="dtr-data">{{ item.email }}</span>
            </li>
          </ul>
        </template>
      </datatable-client>
    </div>
  </header>
</template>

<style></style>
